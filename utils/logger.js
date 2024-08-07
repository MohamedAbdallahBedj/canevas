const fs = require("fs");

const output = fs.createWriteStream('./stdout.log', { flags: 'a' });
const errorOutput = fs.createWriteStream('./stderr.log', { flags: 'a' });
// custom simple logger
const logger = new console.Console(output, errorOutput);
// use it like console

module.exports = { logger };