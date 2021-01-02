#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");
const ora = require("ora");
const download = require("download-git-repo");
const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");

async function create() {
  program.usage("[project-name]");
  program.parse(process.argv);
  // 当没有输入参数的时候给个提示
  if (program.args.length < 1) return program.help();

  // 好比 vue init webpack project-name 的命令一样，第一个参数是 webpack，第二个参数是 project-name
  // let templateName = program.args[0]
  let projectName = program.args[0];
  if (!projectName) {
    console.log(chalk.red("\n Project should not be empty! \n "));
    return;
  }

  const targetDir = path.resolve(projectName || ".");
  if (fs.existsSync(targetDir)) {
    const { action } = await inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: `Target directory ${chalk.cyan(
          targetDir
        )} already exists. Pick an action:`,
        choices: [
          { name: "Overwrite", value: "overwrite" },
          { name: "Merge", value: "merge" },
          { name: "Cancel", value: false }
        ]
      }
    ]);
    if (!action) {
      return;
    } else if (action === "overwrite") {
      console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
      await fs.remove(targetDir);
    }
  }

  console.log(chalk.white("\n Start generating... \n"));
  // 出现加载图标
  const spinner = ora("Downloading...");
  spinner.start();
  // 执行下载方法并传入参数
  download("JamesCZF/vue-template", projectName, err => {
    if (err) {
      spinner.fail();
      console.log(chalk.red(`Generation failed. ${err}`));
      return;
    }
    // 结束加载图标
    spinner.succeed();
    console.log(chalk.green("\n Generation completed!"));
    console.log("\n To get started");
    console.log(`\n cd ${projectName} \n`);
  });
}

create();
