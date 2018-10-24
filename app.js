"use strict";

const router = require("express").Router();

// const Pomodoro = require("./services/pomodoro/Pomodoro");
// router.use(Pomodoro.controller.baseUrl, Pomodoro.controller.router);

let app = require("./mmvece/mmvece")(router);

module.exports = app;
