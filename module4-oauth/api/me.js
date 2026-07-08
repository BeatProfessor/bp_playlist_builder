import * as cookie from 'cookie';

export default async function handler(req, res) {
  const cookies = cookie.parseCookie(req.headers.cookie || '');
  const accessToken = cookies.spotify_access_token;

  if (!accessToken) {
    return res.status(401).send('Access token not found. Please log in.');
  }

  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (response.status !== 200) {
    return res.status(response.status).send(data);
  }

  res.status(200).json(data);
}