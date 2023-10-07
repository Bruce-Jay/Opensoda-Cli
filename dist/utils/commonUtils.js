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
exports.printAllNumberKVMetric = exports.printAllMetricOneTime = exports.printTimeMetric = exports.printMetricData = exports.printRepoInfo = exports.getDownloadPath = void 0;
const getAllMetrics_1 = require("./getFromApi/getAllMetrics");
const getMetric_1 = require("./getFromApi/getMetric");
function getDownloadPath(data, time) {
    const outputFolderPath = `./opendigger-output/${data.repo_author}/`;
    const downloadUrl = outputFolderPath + `${data.repo_name}-${time}.md`;
    return downloadUrl;
}
exports.getDownloadPath = getDownloadPath;
function printRepoInfo(data) {
    console.log(`repo.author: ${data.repo_author}`);
    console.log(`repo.name: ${data.repo_name}`);
    console.log(`repo.url: ${data.repo_url}`);
}
exports.printRepoInfo = printRepoInfo;
function printDataInColumns(data) {
    let result = '';
    const keys = Object.keys(data);
    const values = Object.values(data);
    // 分成四列打印
    const rows = Math.ceil(keys.length / 4);
    for (let row = 0; row < rows; row++) {
        let rowString = ``;
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
function printMetricData(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const repo = argv.r;
        const metric = argv.m;
        const metricData = yield (0, getMetric_1.getMetric)(repo, metric);
        const metricString = printDataInColumns(metricData);
        if (!argv.t) {
            console.log(`需要查询的 metric ${metric} 为:\n${metricString}`);
        }
        return { metricData, metricString };
    });
}
exports.printMetricData = printMetricData;
function printTimeMetric(time, metric, metricData) {
    const value = metricData[time];
    if (value) {
        console.log(`在特定时间 ${time} 查询的 ${metric} 是 ${value}`);
    }
    else {
        console.log(`没有找到对应 ${time} 的值`);
    }
}
exports.printTimeMetric = printTimeMetric;
function printAllMetricOneTime(data, argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const allMetrics = yield (0, getAllMetrics_1.getAllMetrics)(argv.r);
        const time = argv.t;
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
    });
}
exports.printAllMetricOneTime = printAllMetricOneTime;
function printAllNumberKVMetric(argv) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const allMetrics = yield (0, getAllMetrics_1.getAllMetrics)(argv.r);
        for (const eachMetric of allMetrics) {
            const metricName = Object.keys(eachMetric)[0];
            const metricData = eachMetric[metricName];
            for (const numberKV of numberKVNames) {
                if (numberKV === metricName) {
                    let metricString = `metric: ${metricName}\n`;
                    metricString += printDataInColumns(metricData);
                    console.log(metricString);
                }
            }
        }
    });
}
exports.printAllNumberKVMetric = printAllNumberKVMetric;
