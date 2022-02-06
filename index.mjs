#!/usr/bin/env node
"use strict"

import ora from "ora"
import chalk from "chalk"
import gradient from "gradient-string"
import pidFromPort from "pid-from-port"
import { execSync } from "child_process"
import os from "os"

const ports = process.argv.slice(2)
const turboGradient = gradient("#0099F7", "#F11712") // from Turborepo project

const THANK_YOU = "Life is full of choices. Thanks for choosing me!"

async function main() {
  const killed = []
  if (!Array.isArray(ports) || ports.length === 0) return
  console.log(``)

  const list = ports.map((p) => chalk.hex("FE9900")(p)).join(", ")
  const spinner = ora(`Killing: ${list}`).start()

  try {
    if (os.platform() === "win32") {
      for (let i = 0; i < ports.length; i++) {
        const port = ports[i]
        const pid = await pidFromPort(Number(port))
        execSync(`taskkill /pid ${pid} /f`)
        killed.push(port)
      }
    } else {
      const command = (port) => `lsof -i :${port} | grep LISTEN | awk '{print $2}' | xargs kill -9`
      ports.forEach((port) => {
        execSync(command(port), { stdio: "ignore" })
        killed.push(port)
      })
    }
    spinner.succeed(`Goodbye: ${list}`)
    console.log(chalk.bold(turboGradient(`\n>>> ${THANK_YOU}\n`)))
  } catch {
    if (killed.length === 0) {
      spinner.fail("No matching processes belonging to you were found. Nothing is killed.\n")
    } else {
      const killedList = killed.map((p) => chalk.hex("FE9900")(p)).join(", ")
      spinner.succeed(`Goodbye: ${killedList}`)
    }
  }
}

main()
