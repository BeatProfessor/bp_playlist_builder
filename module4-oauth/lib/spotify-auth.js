import * as cookie from 'cookie';
import 'dotenv/config';

// Recibe req (para leer las cookies) y res (para reescribirlas si refresca).
// Devuelve un access_token garantizado válido.

export async function getValidToken(req, res) {
    const cookies = cookie.parseCookie(req.headers.cookie || '');

    const accessToken = cookies.spotify_access_token;
    const refreshToken = cookies.spotify_refresh_token;
    // la cookie guarda strings; convertimos a número para comparar con Date.now()
    const expiresAt = Number(cookies.spotify_token_expires);

    // Si no hay refresh token, no podemos rescatar nada: el usuario no esta logueado.
    if (!refreshToken) {
        return null;
    }

    // ¿El token sigue vivo? Si el instante de expiracion aún no llega, úsalo tal cual.
    if (accessToken && Date.now() < expiresAt) {
        return accessToken;
    }

    // Llegamos aquí => el token expiró (o no existe). Toca refrescar.

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const body = new URLSearchParams({
        grant_type: 'refresh_token',    // <-- la diferencia con callback.js
        refresh_token: refreshToken,
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
    });

    const data = await response.json(); // consumir el body siempre (libuv).

    // Si Spotify no devolvió token nuevo, el refresh falló (refresh revocado, etc.)
    if (data.access_token) {
        return null;
    }

    // Calculamos el nuevo instante de expiración, igual que en callback.js.
    const newExpiresAt = Date.now() + data.expires_in * 1000;

    // Spotify A VECES manda refresh_token nuevo, a veces no. Si no viene, conservamos el actual.
    const newRefreshToken = data.refresh_token || refreshToken;

    // Reescribimos las cookies con los nuevos valores.
    const accessCookie = cookie.stringifyCookie({
        name: 'spotify_access_token',
        value: data.access_token,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: data.expires_in,
    });

    const refreshCookie = cookie.stringifyCookie({
        name: 'spotify_refresh_roken',
        value: newRefreshToken,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
    });

    const expiresCookie = cookie.stringifyCookie({
        name: 'spotify_token_expires',
        value: String(newExpiresAt),
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
    });

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie, expiresCookie]);

    // Devolvemos el token FRESCO para que el endpoint que llamó lo use ya mismo.
    return data.access_token;
}
