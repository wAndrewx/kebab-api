"use strict";
const serverlessExpress = require("@vendia/serverless-express");
// const serverlesshttp = require("serverless-http")
const app = require("./app");

exports.handler = serverlessExpress({ app });
