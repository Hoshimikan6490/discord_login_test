const express = require("express");
const axios = require("axios");
const app = express();
const path = require("path");
require("dotenv").config();

let public_id = process.env.clientId;
let private_id = process.env.clientSecret;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login", (req, res) => {
  const redirect_uri = encodeURIComponent("http://localhost:3000/auth");
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${public_id}&redirect_uri=${redirect_uri}&response_type=code&scope=identify%20guilds`
  );
});

app.get("/auth", async (req, res) => {
  const code = req.query.code;
  const data = {
    client_id: public_id,
    client_secret: private_id,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: "http://localhost:3000/auth",
    scope: "identify guilds",
  };

  let response = await axios.post(
    "https://discord.com/api/oauth2/token",
    new URLSearchParams(data),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const token = response.data.access_token;
  const guilds = await axios.get("https://discord.com/api/users/@me/guilds", {
    headers: {
      authorization: `${response.data.token_type} ${token}`,
    },
  });

  res.send(guilds.data.map((guild) => guild.name).join("\n"));
});

app.listen(3000, () => console.log("Server is running on port 3000"));
