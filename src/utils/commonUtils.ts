import { getAllMetrics } from './getFromApi/getAllMetrics';
import { getMetric } from './getFromApi/getMetric';
import * as fs from 'fs';

interface KVData {
	[key: string]: any;
}

interface TimeIndexedData {
	[time: string]: any;
}

interface MetricIndexedData {
	[metric: string]: any;
}

export function getDownloadPath(data: any, time: any) {
	const outputFolderPath: string = `./opendigger-output/${data.repo_author}/`;
	const downloadUrl: string =
		outputFolderPath + `${data.repo_name}-${time}.md`;
	return downloadUrl;
}

export function printRepoInfo(data: any): void {
	console.log(`repo.author: ${data.repo_author}`);
	console.log(`repo.name: ${data.repo_name}`);
	console.log(`repo.url: ${data.repo_url}`);
}

function printDataInColumns(data: MetricIndexedData) {
	let result = '';
	const keys = Object.keys(data);
	const values = Object.values(data);
	// 分成四列打印
	const rows = Math.ceil(keys.length / 4);

	for (let row = 0; row < rows; row++) {
		let rowString: string = ``;
		for (let column = 0; column < 4; column++) {
			const index = row + column * rows;
			if (index < keys.length) {
				const key = keys[index];
				const value = values[index];
				rowString += `${key}: ${value}\t\t`;
			}
		}
		result += rowString + '\n';
	}

	return result;
}

export async function printMetricData(
	argv: any
): Promise<{ metricData: MetricIndexedData; metricString: string }> {
	const repo: string = argv.r;
	const metric: string = argv.m;
	const metricData: TimeIndexedData = await getMetric(repo, metric);
	const metricString = printDataInColumns(metricData);
	if (!argv.t) {
		console.log(`需要查询的 metric ${metric} 为:\n${metricString}`);
	}
	return { metricData, metricString };
}

export function printTimeMetric(
	time: string,
	metric: string,
	metricData: TimeIndexedData
): void {
	const value: string = metricData[time];
	if (value) {
		console.log(`在特定时间 ${time} 查询的 ${metric} 是 ${value}`);
	} else {
		console.log(`没有找到对应 ${time} 的值`);
	}
}

export async function printAllMetricOneTime(
	data: any,
	argv: any
): Promise<void> {
	const allMetrics: MetricIndexedData[] = await getAllMetrics(argv.r);
	const time: string = argv.t;
	console.log(`selected_time: ${time}`);

	// 由于返回的是一个数组，所以我们需要逐个将其解析出来
	for (const eachMetric of allMetrics) {
		// 把两个 data 合并, 因为后面需要下载。其实这里一是为了和以上的 fork 与 star 的输出保持一致，二是方便获取repo link
		data = Object.assign(data, eachMetric);
		const innerEachMetric = Object.values(eachMetric)[0];
		const value = innerEachMetric[time];
		const key = Object.keys(eachMetric)[0];
		const kv = `${key}: ${value}`;
		const kvLine = `${key}: ${value}\n`;
		const kvString = JSON.stringify(kv);

		// 打印
		console.log(kv);
	}
}

export async function printAllNumberKVMetric(argv: any) {
	const numberKVNames = [
		'openrank',
		'activity',
		'attention',
		'stars',
		'technical_fork',
		'participants',
		'inactive_contributors',
		'bus_factor',
		'issues_new',
		'issues_closed',
		'issue_comments',
		'code_change_lines_add',
		'code_change_lines_remove',
		'code_change_lines_sum',
		'change_requests',
		'change_requests_accepted',
		'change_requests_reviews'
	];

	const allMetrics: MetricIndexedData[] = await getAllMetrics(argv.r);
	for (const eachMetric of allMetrics) {
		const metricName = Object.keys(eachMetric)[0];
		const metricData: MetricIndexedData = eachMetric[metricName];

		for (const numberKV of numberKVNames) {
			if (numberKV === metricName) {
				let metricString: string = `metric: ${metricName}\n`;
				metricString += printDataInColumns(metricData);

				console.log(metricString);
			}
		}
	}
}
