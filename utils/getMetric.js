// 引入 axios 库，用于发送 HTTP 请求
const axios = require('axios');

module.exports = async function getMetric(repository, metric) {
    try {
        // 查找指定仓库的 openrank 的 baseUrl
        const baseUrl = `https://oss.x-lab.info/open_digger/github/`;
        // 定位到具体仓库的具体 metric
        const metricUrl = baseUrl + `${repository}/${metric}.json`;
        // 发送 GET 请求获取信息
        const response = await axios.get(metricUrl);
        const data = {
            metric: response.data
        }
        return data;
    } catch (error) {
        console.error(`${metric}请求失败: `, error);
        throw error;
    }
}

