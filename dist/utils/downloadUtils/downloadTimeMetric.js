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
exports.downloadTimeMetric = void 0;
const fs_1 = __importDefault(require("fs"));
function downloadTimeMetric(data, argv, metricData) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputFolderPath = `./opendigger-output/${data.repo_author}/`;
        const downloadUrl = outputFolderPath + `${data.repo_name}-${argv.m}-${argv.t}.md`;
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
            let outputData = `selected_time: ${argv.t},\n` +
                `repo_author: ${data.repo_author},\n` +
                `repo_name: ${data.repo_name},\n` +
                `repo_url: ${data.repo_url} \n`;
            const TimeMetricData = `在特定时间 ${argv.t} 下, ${argv.m} 的数据为: ${metricData[argv.t]}\n`;
            outputData += TimeMetricData;
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
exports.downloadTimeMetric = downloadTimeMetric;
