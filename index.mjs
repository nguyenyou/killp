#!/usr/bin/env node
"use strict";

import ora from "ora";
import chalk from "chalk";
import gradient from "gradient-string";
import pidFromPort from "pid-from-port";
import { execSync } from "child_process";
import os from "os";

const ports = process.argv.slice(2);
const turboGradient = gradient("#0099F7", "#F11712"); // from Turborepo project

const THANK_YOU = "Life is full of choices. Thanks for choosing me!";

async function main() {
  if (!Array.isArray(ports) || ports.length === 0) return;
  console.log(``);

  const list = ports.map((p) => chalk.hex("FE9900")(p)).join(", ");
  const spinner = ora(`Killing: ${list}`).start();

  try {
    if (os.platform() === "win32") {
      for(let i = 0; i < ports.length; i++) {
        const pid = await pidFromPort(Number(ports[i]));
        execSync(`taskkill /pid ${pid} /f`);
      }
    } else {
      ports.forEach((port) =>
        execSync(`lsof -i:${port} | xargs killall`, { stdio: "ignore" })
      );
    }
    spinner.succeed(`Goodbye: ${list}`);
    console.log(chalk.bold(turboGradient(`\n>>> ${THANK_YOU}\n`)));
  } catch {
    spinner.fail(
      "No matching processes belonging to you were found. Nothing is killed.\n"
    );
  }
}

main();
