const express = require("express");
const studentRoutes = require("./routes/student.routes");
const { controller } = require("./container");

const app = express();

app.use(express.json());

app.use("/api/students", studentRoutes(controller));

module.exports = app;