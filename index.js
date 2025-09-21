const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Tauscht den Authorization Code gegen Access + Refresh Token
app.post("/auth/token", async (req, res) => {
  const code = req.body.code;

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }
    );

    res.json(response.data); // Gibt access_token, refresh_token, expires_in zurück
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(400).json(err.response?.data || { error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
