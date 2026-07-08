import 'dotenv/config';
import crypto from 'crypto';

export default function handler(req, res) {
    
    const state = crypto.randomBytes(16).toString('hex');

    res.setHeader('Set-Cookie', `spotify_auth_state=${state}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax`);

    const clientId = process.env.SPOTIFY_CLIENT_ID;

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: 'http://127.0.0.1:3000/callback',
        scope: 'playlist-modify-public user-read-private playlist-read-private playlist-read-collaborative',
        state: state,
    });

    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

    res.redirect(authUrl);
}