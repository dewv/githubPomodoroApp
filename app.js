"use strict";

// Load MVC controllers
// const svc1Controller = require("./services/svc1/svc1Controller");

let controllers = [
    // svc1Controller
];

// Pass controllers to mmvece setup
let app = require("./mmvece/mmvece")(controllers);

module.exports = app;
