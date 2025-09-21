// index.js
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// CORS erlauben (Frontend Domain optional einschränken)
app.use(cors({ origin: "*" }));

// JSON Body
app.use(express.json());

// Env Variablen
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// 🔹 Tauscht Authorization Code gegen Access + Refresh Token
app.post("/auth/token", async (req, res) => {
  const code = req.body.code;
  if (!code) return res.status(400).json({ error: "Code fehlt" });

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    res.json(response.data); // access_token, refresh_token, expires_in
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(400).json(err.response?.data || { error: err.message });
  }
});

// 🔹 Optionaler Test-Endpunkt für Spotify Redirect
app.get("/callback", (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("Kein Code erhalten");

  res.send(`
    <h2>Spotify Authorization Code erhalten!</h2>
    <p>Code: ${code}</p>
    <p>Frontend kann jetzt diesen Code an /auth/token schicken.</p>
  `);
});

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
