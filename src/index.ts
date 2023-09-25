#!/usr/bin/env node

/**
 * test-cli
 * Opendigger cli research tool
 *
 * @author Yiren Lin <https://github.com/bruce-jay>
 */

import init from './utils/init';
import cli from './utils/cli';
import { getGithubRepo } from './utils/getGithubRepo';
import { downloadResult } from './utils/downloadResult';
import { printMetricData, printTimeMetric, printRepoInfo, printAllMetricOneTime } from './utils/commonUtils';

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

interface KVData {
	[key: string]: any;
}

interface TimeIndexedData {
	[time: string]: any;
}

interface MetricIndexedData {
	[metric: string]: any;
}

module.exports = (async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	const argv = require('yargs/yargs')(process.argv.slice(2))
		.options({
			r: {
				alias: 'repository',
				demand: false,
				describe: '指定查询的仓库，默认为 X-lab2017/oss101',
				type: 'string'
			},
			u: {
				alias: 'user',
				demand: false,
				describe: '查询特定的用户，默认为 X-lab2017',
				type: 'string'
			},
			d: {
				alias: 'download',
				demand: false,
				describe: '是否将结果导出，输入此选择，即为true',
				type: 'boolean'
			},
			m: {
				alias: 'metric',
				demand: false,
				describe: '是否查询特殊的metric，默认为openrank',
				type: 'string'
			},
			t: {
				alias: 'time',
				demand: false,
				describe: '输入需要查询的时间',
				type: 'string'
			}
		})
		.help('h')
		.alias('h', 'help')
		.usage('Usage: opendigger [options]')
		.example(
			'opendigger -r X-lab2017/oss101 -d -m openrank -t 2020-01-01',
			'查询 X-lab2017/oss101 仓库在 2020-01-01 的 openrank 值，并将结果导出到 ./output 文件夹下'
		)
		.epilog('Copyright © 2023 LazyAnasis. All Rights Reserved.').argv;

	// console.log('argvr', argv.r)

	if (argv.r) {
		// 是否填写仓库名，如果没有填写直接不操作，节约计算资源
		let {data, dataString} = getGithubRepo(argv.r);

		// 打印仓库信息
        printRepoInfo(data)
		// 如果 metric 为真，就查询相应的 metric
		if (argv.m) {
            const {metricData, metricString} = await printMetricData(argv)
            dataString += metricString
			if (argv.t) {
                printTimeMetric(argv.t, argv.m, metricData)
			} else {
				// 如果 download 为真，将其下载到 ./output 的一个文件下
				if (argv.d) {
                    await downloadResult(data, argv, metricString);
				}
			}
		} else {
			if (argv.t) {
				printAllMetricOneTime(data, argv)
			} else {
				console.log(
					'Too much to print! Please select a time to get more specified info'
				);
			}
		}
	} else {
		console.log('Please select a repository.');
	}
	// data_origin 代表 fork star 等可以直接看到的数据，用户可以检验是否获取了正确的仓库信息
})();
