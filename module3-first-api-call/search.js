import 'dotenv/config';
async function getAccessToken() {

    const id = process.env.SPOTIFY_CLIENT_ID;
    const secret = process.env.SPOTIFY_CLIENT_SECRET;

    const authString = Buffer.from(`${id}:${secret}`).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authString}`
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();

    return data.access_token;
}
//console.log(await getAccessToken());

async function searchArtist(artistName,accessToken) {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(`artist:"${artistName}"`)}&type=artist&limit=1`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();

    return data.artists.items[0];
}


//const token = await getAccessToken();
//const artista = await searchArtist('Cafe Tacvba', token);
//console.log(artista);

async function searchTracksByArtist(artistName, accessToken) {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(`artist:"${artistName}"`)}&type=track&limit=10`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    
    return data.tracks.items;
}

//const token = await getAccessToken();
//const tracks = await searchTracksByArtist('Soda Stereo', token);
//console.log(tracks);

async function main() {
    const artistName = process.argv[2];
    if (!artistName) {
        console.error('Please provide an artist name as a command-line argument.');
        process.exit(1);
    }
    const accessToken = await getAccessToken();
    const tracks = await searchTracksByArtist(artistName, accessToken);
    console.log(tracks);
}

main();