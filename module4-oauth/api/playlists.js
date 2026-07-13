import { getValidToken } from '../lib/spotify-auth.js';

export default async function handler(req, res) {
    const accessToken = await getValidToken(req, res);

  if (!accessToken) {
    return res.status(401).send('Access token not found. Please log in.');
  }

  const todasLasPlaylists = [];

  let urlActual = 'https://api.spotify.com/v1/me/playlists?limit=50';

  while (urlActual !== null) {
    
    const respuesta = await fetch(urlActual, {
      headers:{
        'Authorization': `Bearer ${accessToken}`,
      },
    });


    const pagina = await respuesta.json();

    todasLasPlaylists.push(...pagina.items);

    urlActual = pagina.next;
  }

  res.status(200).json({
    total: todasLasPlaylists.length,
    playlists: todasLasPlaylists,
  });
  }
  