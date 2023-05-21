#!/usr/bin/env node

/**
 * test-cli
 * Opendigger cli research tool
 *
 * @author Yiren Lin <https://github.com/bruce-jay>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const getGithubRepo = require('./utils/getGithubRepo');
const downloadResult = require('./utils/downloadResult');
const { program } = require('commander');
const { execSync } = require('child_process');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;


(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

    if (flags.repository)  data = await getGithubRepo(flags.repository);

    // 如果 download 为真，将其下载到 ./output 的一个文件下，默认为 output.json
    if (flags.download) {
        try {
            await downloadResult(data);

        } catch (error) {
            console.error('Error occurred while exporting the output: ', error);
            process.exit(1);
        }
    } else {
        console.log(`repo.name: ${data.repo_name}`);
        console.log(`repo.url: ${data.repo_url}`);
        console.log(`仓库 "${flags.repository}" 的 fork 数: ${data.content.forks_count}, 和 star 数: ${data.content.stargazers_count}`);
    }
})();
