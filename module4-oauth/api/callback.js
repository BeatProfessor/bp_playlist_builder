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
  res.status(200).send('Conexión con Spotify exitosa. Tokens recibidos correctamente.')
}