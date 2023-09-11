const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { URLSearchParams } = require("url");
const app = express();

var config = {
  clientId: "1150702670269653023",
  clientSecret: "mKk2hnoi2klMJC5DqqzrPtwnn0YK_ovC",
  redirectUri: "http://localhost:80/authorize",
};

app.get("/", (request, response) => {
  response.send(
    'login with discord: <a href="https://discord.com/api/oauth2/authorize?client_id=1150702670269653023&redirect_uri=http%3A%2F%2Flocalhost%3A80%2Fauthorize&response_type=code&scope=identify">login</a>'
  );
});

app.get("/authorize", (request, response) => {
  var code = request.query["code"];
  var params = new URLSearchParams();
  params.append("client_id", config["clientId"]);
  params.append("client_secret", config["clientSecret"]);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", config["redirectUri"]);
  fetch(`https://discord.com/api/oauth2/token`, {
    method: "POST",
    body: params,
  })
    .then((res) => res.json())
    .then((json) => {
      response.send("logged in");
    });
});

app.listen(80, () => {
  console.log("Listening on :80");
});
