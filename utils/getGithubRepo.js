// 引入 axios 库，用于发送 HTTP 请求
const axios = require('axios');

module.exports = async function getGithubRepo(repository) {
    try {
    // 构建 GitHub API 的 URL
    const apiUrl = `https://api.github.com/repos/${repository}`;

    // 发送 GET 请求获取仓库信息
    const response = await axios.get(apiUrl);

    // 提取 fork 数和 star 数
    const { forks_count, stargazers_count } = response.data;
        
    // 返回 fork 数和 star 数，并在控制台打印一次
    const data = {
      forks: forks_count,
      stars: stargazers_count,
    };
    
    console.log(`仓库 "${repository}" 的 fork 数和 star 数:`, data);
        
    return data;
  } catch (error) {
    // 处理错误情况
    if (error.response) {
      // 请求发出，但响应状态码不在 2xx 范围内
      console.error('GitHub API 请求失败:', error.response.data.message);
    } else if (error.request) {
      // 请求发出，但没有收到响应
      console.error('无法连接到 GitHub API:', error.request);
    } else {
      // 发生了其他错误
      console.error('处理 GitHub API 请求时发生错误:', error.message);
    }

    // 返回空对象表示获取信息失败
    return {};
  }
}