require("dotenv").config();

const util = require("util");
const path = require("path");
const express = require("express");
const app = express();
const disk = require("diskusage");
const fs = require("fs");
const stat = util.promisify(fs.stat);

app.get("/vod/stats", (req, res) => {
  const stats = {};

  disk.check(process.env.VOD_DIRECTORY).then(disk => {
    stats.diskUsagePercent = Math.round(
      ((disk.total - disk.available) / disk.total) * 100
    );

    res.send(stats);
  });
});

app.get("/vod/index", (req, res) => {
  fs.readdir(process.env.VOD_DIRECTORY, (err, files) => {
    if (err) {
      throw err;
    }

    res.send(files.filter(name => name.endsWith(".flv")));
  });
});

app.listen(+process.env.API_PORT, err => {
  if (err) {
    throw err;
  }

  console.log("Livestream API listening on port " + process.env.API_PORT);
});
