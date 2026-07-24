export default function handler(_req, res) {
  res.status(200).json({
    status: "ok",
    service: "bp-playlist-builder",
    timestamp: new Date().toISOString(),
  });
}
