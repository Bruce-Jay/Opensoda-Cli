import fs from 'fs';

import { getAllMetrics } from '../getFromApi/getAllMetrics';

interface MetricIndexedData {
	[metric: string]: any;
}

export async function downloadAllMetricsOfOneTime(data: any, argv: any) {
	const outputFolderPath = `./opendigger-output/${data.repo_author}/`;
	const downloadUrl = outputFolderPath + `${data.repo_name}-${argv.t}.md`;

	try {
		// 判断 output 文件夹是否存在，如果不存在则创建
		if (!fs.existsSync(outputFolderPath)) {
			try {
				fs.mkdirSync(outputFolderPath, { recursive: true });
				console.log(
					`Created ${outputFolderPath} directory successfully.`
				);
			} catch (error) {
				console.error(
					`Error occurred while creating ${outputFolderPath} directory:`,
					error
				);
			}
		}

		// 如果要写入的文件不存在，就创建一个
		if (!fs.existsSync(downloadUrl)) {
			try {
				fs.writeFileSync(downloadUrl, '');
				console.log(`Created ${data.repo_name}.md file successfully.`);
			} catch (error) {
				console.error(
					`Error occurred while creating ${data.repo_name}.md file:`,
					error
				);
			}
		} else {
			// 清空文件
			fs.truncate(downloadUrl, 0, (err: any) => {
				if (err) {
					console.error('Error cleaning files:', err);
				}
			});
		}

		let outputData = `# Opendigger Data Analysis - ${data.repo_author}/${data.repo_name}\n` +
							`### Repo\n` +
							`selected_time: ${argv.t},\n` +
							`repo_author: ${data.repo_author},\n` +
							`repo_name: ${data.repo_name},\n` +
							`repo_url: ${data.repo_url}\n` + 
							`### Metric\n`;

		const allMetrics: MetricIndexedData[] = await getAllMetrics(argv.r)
		const time: string = argv.t;

		for (const eachMetric of allMetrics) {
			const metricName: string = Object.keys(eachMetric)[0];
			const metricData: MetricIndexedData = eachMetric[metricName];
			const metricValue = metricData[time];
			outputData += `${metricName}: ${metricValue}\n`;
		}

		fs.writeFile(downloadUrl, outputData, (err: any) => {
			if (err) {
				console.error('Error writing file: ', err);
			} else {
				console.log(`File saved successfully at ${downloadUrl}`);
			}
		});

	} catch (error) {
		console.error('Error occurred while exporting the output: ', error);
		process.exit(1);
	}
}
