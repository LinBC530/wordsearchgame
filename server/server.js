// Env
require("dotenv").config();

// Express
const express = require("express");
const app = express();

// SSL
const fs = require("fs");
const options = {
  key: fs.readFileSync(process.env.SSL_KEY),
  cert: fs.readFileSync(process.env.SSL_CERT),
};

// cors
const cors = require("cors");
app.use(cors());

// API
const api = require("./services/api/main");
app.use(express.json());
app.use("/api", api);


// https
const https = require("https").Server(options, app);
https.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
