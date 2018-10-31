"use strict";

require("should");

const Pomodoro = require("../../services/pomodoro/Pomodoro");
const modelTests = require("../../mmvece/test/Model");

// TODO define properties for two testData objects
let testData = [{
    id: undefined,
}, {
    id: undefined,
}];

modelTests(Pomodoro, testData);
