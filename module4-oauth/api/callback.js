import * as cookie from 'cookie';
import 'dotenv/config';

export default async function handler(req, res) {
  const { code, state } = req.query;

  const cookies = cookie.parseCookie(req.headers.cookie || '');
  const savedState = cookies.spotify_auth_state;

  if (!state || state !== savedState) {
    return res.status(403).send('State mismatch. Possible CSRF attack.');
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: 'http://127.0.0.1:3000/callback',
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body,
  });

  const data = await response.json();
 
  // ───── NUEVO: guardar los tokens ─────

  // 1. expires_in viene en SEGUNDOS y es relativo ("3600 segundos desde ahora").
  //    Date.now() da el "ahora" en MILISEGUNDOS. Por eso multiplico por 1000:
  //    convierto segundos→milisegundos para sumarlos a la misma escala.
  //    Resultado: el instante ABSOLUTO (en ms) en que el access_token muere.

  const expiresAt = Date.now() + data.expires_in * 1000;

  // 2. Armo cada cookie. maxAge en la librería 'cookie' va en SEGUNDOS.
  //    httpOnly: el JS del navegador no la puede leer (anti-XSS).
  //    sameSite 'lax': defensa anti-CSRF.
  //    OJO: nada de 'secure' todavía — estás en HTTP local; con secure el
  //    navegador NO guardaría la cookie. Se activa en el Módulo 12 (HTTPS).

  const accessCookie = cookie.stringifySetCookie({
    name: 'spotify_access_token',
    value: data.access_token,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: data.expires_in, // vive lo mismo que el token: 1 hora
  });

  const refreshCookie = cookie.stringifySetCookie({
    name: 'spotify_refresh_token',
    value: data.refresh_token,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 días (el refresh no expira, pero la cookie sí necesita un tope)
  });

  // El valor de una cookie debe ser string; expiresAt es número → String(...)
    const expiresCookie = cookie.stringifySetCookie({
    name: 'spotify_token_expires',
    value: String(expiresAt),
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // tiene que vivir tanto como el refresh
  });

  // 3. Borrar el state: ya cumplió su función anti-CSRF.
  //    "Borrar" = sobrescribir con valor vacío y maxAge 0 → el navegador la tira.
  const clearState = cookie.stringifySetCookie({
    name: 'spotify_auth_state',
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  // 4. Mandar TODAS en un solo header. Set-Cookie acepta un array de strings.
  //    Si llamaras setHeader('Set-Cookie', ...) varias veces, la última pisa
  //    a las anteriores y perderías cookies.
  res.setHeader('Set-Cookie', [accessCookie, refreshCookie, expiresCookie, clearState]);

  // 5. Responder. 200 (OK), no 201 — el 201 era "Created" de la playlist, que ya no creamos.
  res.status(200).send('Conexión exitosa.');
}
