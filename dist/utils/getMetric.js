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
exports.getMetric = void 0;
// 引入 axios 库，用于发送 HTTP 请求
const axios = require('axios');
function getMetric(repository, metric) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 查找指定仓库的 openrank 的 baseUrl
            const baseUrl = `https://oss.x-lab.info/open_digger/github/`;
            // 定位到具体仓库的具体 metric
            const metricUrl = baseUrl + `${repository}/${metric}.json`;
            // 发送 GET 请求获取信息
            const response = yield axios.get(metricUrl);
            // const data = {
            // 	metric: response.data
            // };
            return response.data;
        }
        catch (error) {
            console.error(`${metric}请求失败: `, error);
            throw error;
        }
    });
}
exports.getMetric = getMetric;
