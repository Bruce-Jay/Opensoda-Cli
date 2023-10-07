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
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadResult = void 0;
const fs = __importStar(require("fs"));
const echarts = __importStar(require("echarts"));
const canvas_1 = require("canvas");
function renderChart(metric, metricData) {
    // 使用 echarts, canvas + SSR
    const canvas = (0, canvas_1.createCanvas)(800, 600);
    const chart = echarts.init(canvas);
    const option = {
        title: {
            text: `${metric} trends`,
        },
        xAxis: {
            name: 'Time',
            type: 'category',
            data: Object.keys(metricData),
        },
        yAxis: {
            name: `${metric} value`,
            type: 'value',
        },
        series: [
            {
                name: `${metric}`,
                data: Object.values(metricData),
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
function downloadResult(data, argv, metricData) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputFolderPath = `./opendigger-output/${data.repo_author}/`;
        const downloadUrl = outputFolderPath + `${data.repo_name}-${argv.m}.md`;
        try {
            // 判断 output 文件夹是否存在，如果不存在则创建
            if (!fs.existsSync(outputFolderPath)) {
                try {
                    fs.mkdirSync(outputFolderPath, { recursive: true });
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
            if (!fs.existsSync(downloadUrl)) {
                try {
                    fs.writeFileSync(downloadUrl, '');
                    console.log(`Created ${data.repo_name}.md file successfully.`);
                }
                catch (error) {
                    console.error(`Error occurred while creating ${data.repo_name}.md file:`, error);
                }
            }
            else {
                // 清空文件
                fs.truncate(downloadUrl, 0, (err) => {
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
                `### Metric\n` +
                `#### metric_name: ${argv.m}\n`;
            // 使用 canvas 生成图片
            fs.writeFile(`${outputFolderPath}${argv.m}.png`, renderChart(argv.m, metricData).toBuffer('image/png'), (err) => {
                if (err) {
                    console.error('Error writing file: ', err);
                }
                else {
                    console.log(`File saved successfully at ${outputFolderPath}${argv.m}.png`);
                }
            });
            const chartImage = `![${argv.m} trends](./${argv.m}.png)\n`;
            outputData += chartImage;
            let result = `| Dates and ${argv.m}: | | | |\n| --- | --- | --- | --- |\n`;
            const keys = Object.keys(metricData);
            const values = Object.values(metricData);
            const rows = Math.ceil(keys.length / 4);
            for (let row = 0; row < rows; row++) {
                let rowString = ``;
                for (let column = 0; column < 4; column++) {
                    const index = row + column * rows;
                    if (index < keys.length) {
                        const key = keys[index];
                        const value = values[index];
                        rowString += `|${key}: ${value}`;
                    }
                }
                result += rowString + '|\n';
            }
            outputData += result;
            fs.writeFile(downloadUrl, outputData, (err) => {
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
}
exports.downloadResult = downloadResult;
