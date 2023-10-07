"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadAll = void 0;
const fs_1 = __importDefault(require("fs"));
const echarts = __importStar(require("echarts"));
const canvas_1 = require("canvas");
const getAllMetrics_1 = require("../getFromApi/getAllMetrics");
function renderChart(metric, metricData) {
    // 使用 echarts, canvas + SSR
    const canvas = (0, canvas_1.createCanvas)(800, 600);
    const chart = echarts.init(canvas);
    let metricArr = Object.entries(metricData);
    if (metricArr[metricArr.length - 1][0].includes('raw')) {
        metricArr = metricArr.slice(0, metricArr.length - 1);
    }
    const option = {
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
    };
    chart.setOption(option);
    return canvas;
}
// 目前先实现导出所有 value 是数值的 metrics
const downloadAll = (data, argv) => __awaiter(void 0, void 0, void 0, function* () {
    const outputFolderPath = `./opendigger-output/${data.repo_author}/`;
    const downloadUrl = outputFolderPath + `${data.repo_name}.md`;
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
    try {
        // 判断 output 文件夹是否存在，如果不存在则创建
        if (!fs_1.default.existsSync(outputFolderPath)) {
            try {
                fs_1.default.mkdirSync(outputFolderPath, { recursive: true });
                console.log(`Created ${outputFolderPath} directory successfully.`);
            }
            catch (error) {
                console.error(`Error occurred while creating ${outputFolderPath} directory:`, error);
            }
        }
        else {
            console.log(`${outputFolderPath} directory already exists.`);
        }
        // 如果要写入的文件不存在，就创建一个
        if (!fs_1.default.existsSync(downloadUrl)) {
            try {
                fs_1.default.writeFileSync(downloadUrl, '');
                console.log(`Created ${data.repo_name}.md file successfully.`);
            }
            catch (error) {
                console.error(`Error occurred while creating ${data.repo_name}.md file:`, error);
            }
        }
        else {
            // 清空文件
            fs_1.default.truncate(downloadUrl, 0, (err) => {
                if (err) {
                    console.log('Error cleaning files:', err);
                }
            });
        }
        let outputData = `# Opendigger Data Analysis - ${data.repo_author}/${data.repo_name}\n` +
            `### Repo\n` +
            `\`repo_author\`: ${data.repo_author}\n` +
            `\`repo_name\`: ${data.repo_name}\n` +
            `\`repo_url\`: ${data.repo_url}\n` +
            `### Metrics\n`;
        const allMetrics = yield (0, getAllMetrics_1.getAllMetrics)(argv.r);
        for (const eachMetric of allMetrics) {
            const metricName = Object.keys(eachMetric)[0];
            const metricData = eachMetric[metricName];
            for (const numberKV of numberKVNames) {
                if (numberKV === metricName) {
                    const metricTitle = `#### metric_name: ${metricName}\n`;
                    const chartImage = `![${metricName} trends](./${metricName}.png)\n`;
                    // 使用 canvas 生成图片
                    fs_1.default.writeFile(`${outputFolderPath}${metricName}.png`, renderChart(metricName, metricData).toBuffer('image/png'), (err) => {
                        if (err) {
                            console.error('Error writing file: ', err);
                        }
                        else {
                            console.log(`File saved successfully at ${outputFolderPath}${metricName}.png`);
                        }
                    });
                    outputData += metricTitle;
                    outputData += chartImage;
                    let table = `| Dates and ${metricName}: | | | |\n| --- | --- | --- | --- |\n`;
                    const keys = Object.keys(metricData);
                    const values = Object.values(metricData);
                    const rows = Math.ceil(keys.length / 4);
                    let metricArr = Object.entries(metricData);
                    if (metricArr[metricArr.length - 1][0].includes('raw')) {
                        metricArr = metricArr.slice(0, metricArr.length - 1);
                    }
                    for (let row = 0; row < rows; row++) {
                        let rowString = ``;
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
                    outputData += table;
                }
            } // 不存在数字 value 的键值就不画图，不生成数据表格
        }
        fs_1.default.writeFile(downloadUrl, outputData, (err) => {
            if (err) {
                console.error('Error writing file: ', err);
            }
            else {
                console.log(`File saved successfully at ${downloadUrl}`);
            }
        });
    }
    catch (error) {
        console.error('Error occurred while exporting the output: ', error);
        process.exit(1);
    }
});
exports.downloadAll = downloadAll;
