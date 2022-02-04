#!/usr/bin/env node
"use strict";

import util from "util";
import ora from "ora";
import chalk from "chalk";
import gradient from "gradient-string";
import childProcess from "child_process";
const exec = util.promisify(childProcess.exec);

const ports = process.argv;
ports.shift();
ports.shift();
const turboGradient = gradient("#0099F7", "#F11712");

const THANK_YOU = "Life is full of choices. Thanks for choosing me!"

async function main() {
  if (!Array.isArray(ports) || ports.length === 0) return;

  const spinner = ora(
    `Goodbye: ${ports.map((p) => chalk.green(p)).join(", ")}`
  ).start();

  const jobs = ports.map((port) => exec(`lsof -i:${port} |xargs killall`));
  await Promise.all(jobs);

  spinner.succeed();
  console.log(chalk.bold(turboGradient(`\n>>> ${THANK_YOU}\n`)));
}

main();
