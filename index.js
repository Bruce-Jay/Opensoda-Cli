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
const generateWebComponent = require('./utils/generateWebComponent');
const getGithubRepo = require('./utils/getGithubRepo')

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	flags.repository && (await getGithubRepo(flags.repository))
})();
