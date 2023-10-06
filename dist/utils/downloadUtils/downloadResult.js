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
function downloadResult(data, argv, metricString) {
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
            let outputData = `repo_author: ${data.repo_author}\n` +
                `repo_name: ${data.repo_name}\n` +
                `repo_url: ${data.repo_url}\n` +
                `metric_name: ${argv.m}\n`;
            outputData += metricString;
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
