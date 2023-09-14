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
exports.getGithubRepo = void 0;
const axios = require('axios');
function getGithubRepo(repository) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repo_author = repository.split('/')[0];
            const repo_name = repository.split('/')[1];
            // 构建 GitHub API 的 URL
            const apiUrl = `https://api.github.com/repos/${repository}`;
            // 发送 GET 请求获取仓库信息
            const response = yield axios.get(apiUrl);
            // 返回 fork 数和 star 数
            const data = {
                repo_author: repo_author,
                repo_name: repo_name,
                repo_url: `https://github.com/${repository}`,
                content: response.data
            };
            return data;
        }
        catch (error) {
            // 处理错误情况
            if (error.response) {
                // 请求发出，但响应状态码不在 2xx 范围内
                console.error('GitHub API 请求失败:', error.response.data.message);
            }
            else if (error.request) {
                // 请求发出，但没有收到响应
                console.error('无法连接到 GitHub API:', error.request);
            }
            else {
                // 发生了其他错误
                console.error('处理 GitHub API 请求时发生错误:', error.message);
            }
            // 返回空对象表示获取信息失败
            return {};
        }
    });
}
exports.getGithubRepo = getGithubRepo;
