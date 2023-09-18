import { downloadAllMetrics, getDownloadPath } from "./downloadAllMetrics";
import { getAllMetrics } from "./getAllMetrics";
import { getMetric } from "./getMetric";
const fs = require('fs');

interface KVData {
	[key: string]: any;
}

interface TimeIndexedData {
	[time: string]: any;
}

interface MetricIndexedData {
	[metric: string]: any;
}

export function printRepoInfo(data: any, argv: any): void {
    const repo_info = `repo.name: ${data.repo_name}
repo.url: ${data.repo_url}
仓库 "${argv.r}" 的 fork 数: ${data.content.forks_count}, 和 star 数: ${data.content.stargazers_count}`
    console.log(repo_info)
}

export async function printMetricData(argv: any): Promise<TimeIndexedData> {
    const repo: string = argv.r
    const metric: string = argv.m
    const metricData: TimeIndexedData = await getMetric(repo, metric)
    const metricString = JSON.stringify(metricData)
    if (!argv.t) {
        console.log(`需要查询的metric ${metric} 为: `, metricString)
    }
    
    return metricData
}

export async function printTimeMetric(time: string, metric: string, metricData: TimeIndexedData): Promise<void> {
    const value: string = metricData[time]
    if (value) {
        console.log(
            `在特定时间 ${time} 查询的 ${metric} 是 ${value}`
        );
    } else {
        console.log(`没有找到对应 ${time} 的值`);
    }
}

export async function printAllMetricOneTime(data: any, argv: any): Promise<void> {
    const allMetrics: MetricIndexedData[] = await getAllMetrics(
        argv.r
    );
    const time: string = argv.t;
    console.log(`selected_time: ${time}`);
    // 不能在 for 循环里面用否则会乱
    
    const downloadUrl: string = await getDownloadPath(
        data,
        time
    );
    
    if(argv.d) {
        await downloadAllMetrics(data, time);
    }
    

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

        // console.log(`在特定时间 ${time} 查询的 ${key} 是 ${value}`)
        // 如果 download 为真，将其下载到 ./output 的一个文件下
        if (argv.d) {
            try {
                // 获取文件地址开始写入
                fs.appendFile(downloadUrl, kvLine, (err: any) => {
                    if (err) {
                        console.error('Error writing file: ', err);
                    }
                });
            } catch (error) {
                console.error(
                    'Error occurred while exporting the output: ',
                    error
                );
                process.exit(1);
            }
        } 
        // 无论保不保存，直接在控制台上打印
        console.log(kv);
        
    }
}
