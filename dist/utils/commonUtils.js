"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printAllMetricOneTime = exports.printTimeMetric = exports.printMetricData = exports.printRepoInfo = void 0;
const downloadAllMetrics_1 = require("./downloadAllMetrics");
const getAllMetrics_1 = require("./getAllMetrics");
const getMetric_1 = require("./getMetric");
const fs = require('fs');
function printRepoInfo(data, argv) {
    const repo_info = `repo.name: ${data.repo_name}
repo.url: ${data.repo_url}
仓库 "${argv.r}" 的 fork 数: ${data.content.forks_count}, 和 star 数: ${data.content.stargazers_count}`;
    console.log(repo_info);
}
exports.printRepoInfo = printRepoInfo;
function printMetricData(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const repo = argv.r;
        const metric = argv.m;
        const metricData = yield (0, getMetric_1.getMetric)(repo, metric);
        const metricString = JSON.stringify(metricData);
        if (!argv.t) {
            console.log(`需要查询的metric ${metric} 为: `, metricString);
        }
        return metricData;
    });
}
exports.printMetricData = printMetricData;
function printTimeMetric(time, metric, metricData) {
    return __awaiter(this, void 0, void 0, function* () {
        const value = metricData[time];
        if (value) {
            console.log(`在特定时间 ${time} 查询的 ${metric} 是 ${value}`);
        }
        else {
            console.log(`没有找到对应 ${time} 的值`);
        }
    });
}
exports.printTimeMetric = printTimeMetric;
function printAllMetricOneTime(data, argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const allMetrics = yield (0, getAllMetrics_1.getAllMetrics)(argv.r);
        const time = argv.t;
        console.log(`selected_time: ${time}`);
        // 不能在 for 循环里面用否则会乱
        const downloadUrl = yield (0, downloadAllMetrics_1.getDownloadPath)(data, time);
        if (argv.d) {
            yield (0, downloadAllMetrics_1.downloadAllMetrics)(data, time);
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
                    fs.appendFile(downloadUrl, kvLine, (err) => {
                        if (err) {
                            console.error('Error writing file: ', err);
                        }
                    });
                }
                catch (error) {
                    console.error('Error occurred while exporting the output: ', error);
                    process.exit(1);
                }
            }
            // 无论保不保存，直接在控制台上打印
            console.log(kv);
        }
    });
}
exports.printAllMetricOneTime = printAllMetricOneTime;
