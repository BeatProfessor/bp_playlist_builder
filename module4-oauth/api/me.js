import { getValidToken } from '../lib/spotify-auth.js';

export default async function handler(req, res) {
  const accessToken = await getValidToken(req, res);

  if (!accessToken) {
    return res.status(401).json({'error': 'No autenticado. Conecta a Spotify primero.'});
  }

  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const perfil = await response.json
  res.status(200).json(data);
}