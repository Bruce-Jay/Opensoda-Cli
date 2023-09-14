const axios = require('axios');

export async function getGithubRepo(repository: string) {
	try {
		const repo_author = repository.split('/')[0];
		const repo_name = repository.split('/')[1];
		// 构建 GitHub API 的 URL
		const apiUrl = `https://api.github.com/repos/${repository}`;
		// 发送 GET 请求获取仓库信息
		const response = await axios.get(apiUrl);

		// 返回 fork 数和 star 数
		const data = {
			repo_author: repo_author,
			repo_name: repo_name,
			repo_url: `https://github.com/${repository}`,
			content: response.data
		};

		return data;
	} catch (error: any) {
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
