import fs from 'fs';
import * as echarts from 'echarts';
import { createCanvas } from 'canvas';

import { getAllMetrics } from '../getFromApi/getAllMetrics';

interface MetricIndexedData {
	[metric: string]: any;
}

function renderChart(metric: any, metricData: MetricIndexedData) {
	// 使用 echarts, canvas + SSR
	const canvas: any = createCanvas(800, 600);
	const chart = echarts.init(canvas);
	let metricArr = Object.entries(metricData);
	if (metricArr[metricArr.length - 1][0].includes('raw')) {
		metricArr = metricArr.slice(0, metricArr.length - 1);
	}

	const option: any = {
		title: {
			text: `${metric} trends`,
		},
		xAxis: {
			name: 'Time',
			type: 'category',
		},
		yAxis: {
			name: `${metric} value`,
			type: 'value',
		},
		series: [
			{
				name: `${metric}`,
				data: metricArr,
				type: 'line',
				lineStyle: {
					color: 'red',
				},
				showSymbol: false,
			}
		]
	}
	
	chart.setOption(option);
	return canvas;
}

// 目前先实现导出所有 value 是数值的 metrics
export const downloadAll = async(data: any, argv: any) => {
    const outputFolderPath = `./opendigger-output/${data.repo_author}/`;
    const downloadUrl = outputFolderPath + `${data.repo_name}.md`

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
    ]

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
		} else {
			console.log(`${outputFolderPath} directory already exists.`);
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
					console.log('Error cleaning files:', err)
				}
			})
		}

        let outputData = 	`# Opendigger Data Analysis - ${data.repo_author}/${data.repo_name}\n` +
							`### Repo\n` +
							`\`repo_author\`: ${data.repo_author}\n` +
							`\`repo_name\`: ${data.repo_name}\n` +
							`\`repo_url\`: ${data.repo_url}\n` + 
							`### Metrics\n`;

        const allMetrics: MetricIndexedData[] = await getAllMetrics(argv.r);

        for (const eachMetric of allMetrics) {
            const metricName = Object.keys(eachMetric)[0]
            const metricData: MetricIndexedData = eachMetric[metricName]
            
            for (const numberKV of numberKVNames) {
                if (numberKV === metricName) {
                    const metricTitle = `#### metric_name: ${metricName}\n`;
                    const chartImage = `![${metricName} trends](./${metricName}.png)\n`
                    // 使用 canvas 生成图片
                    fs.writeFile(`${outputFolderPath}${metricName}.png`, renderChart(metricName, metricData).toBuffer('image/png'), (err: any) => {
                        if (err) {
                            console.error('Error writing file: ', err);
                        } else {
                            console.log(`File saved successfully at ${outputFolderPath}${metricName}.png`);
                        }
                    });
                    outputData += metricTitle
                    outputData += chartImage
                    let table = `| Dates and ${metricName}: | | | |\n| --- | --- | --- | --- |\n`;
                    const keys = Object.keys(metricData)
                    const values = Object.values(metricData)
                    const rows = Math.ceil(keys.length / 4);
					let metricArr = Object.entries(metricData);
					if (metricArr[metricArr.length - 1][0].includes('raw')) {
						metricArr = metricArr.slice(0, metricArr.length - 1);
					}
                    for (let row = 0; row < rows; row++) {
                        let rowString: string = ``;
                        for (let column = 0; column < 4; column++) {
                            const index = row + column * rows;
                            if (index < metricArr.length) {
                                const key = metricArr[index][0];
								const value = metricArr[index][1];
								rowString += `|${key}: ${value}`;
                            }
                        }
                        table += rowString + '|\n';
                    }
                    outputData += table
                }
            } // 不存在数字 value 的键值就不画图，不生成数据表格
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