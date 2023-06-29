// 引入 axios 库，用于发送 HTTP 请求
const axios = require('axios');

module.exports = async function getAllMetrics(repository) {
    
    // 查找指定仓库的 baseUrl
    const repoUrl = `https://oss.x-lab.info/open_digger/github/${repository}/`;
    // 获取 json 文件
    const jsonFileNames = ['openrank', 'activity', 'attention', 'active_dates_and_times',
                        'stars', 'technical_fork', 'participants', 'new_contributors', 
                        'new_contributors_detail', 'inactive_contributors', 'bus_factor',
                        'bus_factor_detail', 'issues_new', 'issues_closed', 'issue_comments',
                        'code_change_lines_add', 'code_change_lines_remove', 'code_change_lines_sum',
                        'change_requests', 'change_requests_accepted', 'change_requests_reviews',
                        ]
    // 定义一个数组，用于存储每个 JSON 文件的数据
    const jsonData = [];

    // 使用循环遍历获取每个 JSON 文件的数据
    for (const fileName of jsonFileNames) {
        try {
            const response = await axios.get(repoUrl + fileName + '.json');
            const data = response.data;
            jsonData.push({[fileName]: data});
            console.log(`Fetched data from ${fileName}`);
        } catch (error) {
            console.error(`Error fetching data from ${fileName}: `, error.message);
        }
    }
    // console.log(jsonData);
    return jsonData;
}