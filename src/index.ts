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
import { downloadResult } from './utils/downloadUtils/downloadResult';
import { downloadTimeMetric } from './utils/downloadUtils/downloadTimeMetric';
import { downloadAllMetricsOfOneTime } from './utils/downloadUtils/downloadAllMetricsOfOneTime';
import { downloadAll } from './utils/downloadUtils/downloadAll';
import { printMetricData, printTimeMetric, printRepoInfo, printAllMetricOneTime, printAllNumberKVMetric } from './utils/commonUtils';

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
				demand: true,
				describe: '指定查询的仓库',
				type: 'string'
			},
			d: {
				alias: 'download',
				demand: false,
				describe: '是否将结果导出，输入此选项，即为 true',
				type: 'boolean'
			},
			m: {
				alias: 'metric',
				demand: false,
				describe: '是否指定 metric 查询',
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
			'opendigger -r X-lab2017/oss101 -d -m openrank -t 2023-01',
			'查询 X-lab2017/oss101 仓库在 2023-01 的 openrank 值，并将结果导出到 ./opendigger-output 文件夹下'
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
			if (argv.t) { // opendigger -r=valhalla/valhalla -m=openrank -t=2023-xx
                printTimeMetric(argv.t, argv.m, metricData)
				if (argv.d) { // opendigger -r=valhalla/valhalla -m=openrank -t=2023-xx -d
					await downloadTimeMetric(data, argv, metricData);
				}
			} else {
				// 如果 download 为真，将其下载到 ./output 的一个文件下
				if (argv.d) { // opendigger -r=valhalla/valhalla -m=openrank -d
                    await downloadResult(data, argv, metricData);
				}
			}
		} else {
			if (argv.t) { // opendigger -r=valhalla/valhalla -t=2023-xx
				printAllMetricOneTime(data, argv)
				if (argv.d) { // opendigger -r=valhalla/valhalla -t=2023-xx -d
					await downloadAllMetricsOfOneTime(data, argv);
				}
			} else {
				if (argv.d) { // opendigger -r=valhalla/valhalla -d
					await downloadAll(data, argv)
				} 
				else { // opendigger -r=valhalla/valhalla
					printAllNumberKVMetric(argv); // 打印所有的数值型 metric
				}
			}
		}
	} else {
		console.log('Please select a repository.');
	}
	// data_origin 代表 fork star 等可以直接看到的数据，用户可以检验是否获取了正确的仓库信息
})();
