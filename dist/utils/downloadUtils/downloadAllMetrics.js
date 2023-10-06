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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadAllMetrics = void 0;
const fs_1 = __importDefault(require("fs"));
const getAllMetrics_1 = require("../getFromApi/getAllMetrics");
// 原来想在这里实现写入文件，发现不可行，因为有太多键值，无法一一取出，所以这里就做一个文件写入是否合法检测吧！
// 同时，因为我们 for 循环里面写入只能 append 所以每次生成一个新的文件需要先清空
function downloadAllMetrics(data, argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputFolderPath = `./opendigger-output/${data.repo_author}/`;
        const downloadUrl = outputFolderPath + `${data.repo_name}-${argv.t}.md`;
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
            const allMetrics = yield (0, getAllMetrics_1.getAllMetrics)(argv.r);
            const time = argv.t;
            for (const eachMetric of allMetrics) {
                const metricName = Object.keys(eachMetric)[0];
                const metricData = eachMetric[metricName];
                const metricValue = metricData[time];
                outputData += `${metricName}: ${metricValue}\n`;
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
}
exports.downloadAllMetrics = downloadAllMetrics;
