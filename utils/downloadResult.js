const fs = require('fs');

module.exports = async function downloadResult(data, options) {
    const outputFolderPath = `./output/${data.repo_author}/`;
    const downloadUrl = outputFolderPath + `${data.repo_name}.txt`;

    try {
        // 判断 output 文件夹是否存在，如果不存在则创建
        if (!fs.existsSync(outputFolderPath)) {
            try {
                fs.mkdirSync(outputFolderPath, { recursive: true });
                console.log(`Created ${outputFolderPath} directory successfully.`);
            } catch (error) {
                console.error(`Error occurred while creating ${outputFolderPath} directory:`, error);
            }
        } else {
            console.log(`${outputFolderPath} directory already exists.`);
        }

        // 如果要写入的文件不存在，就创建一个
        if (!fs.existsSync(downloadUrl)) {
            try {
            fs.writeFileSync(downloadUrl, '');
            console.log(`Created ${data.repo_name}.txt file successfully.`);
            } catch (error) {
            console.error(`Error occurred while creating ${data.repo_name}.txt file:`, error);
            }
        }

        const metricString = JSON.stringify(data.metric, null, 2);
        // console.log(data.metric);
        // console.log(metricString);
        const outputData = 
`repo_name: ${data.repo_name},
repo_url: ${data.repo_url},
forks: ${data.content.forks_count},
stars: ${data.content.stargazers_count},
${options.metric}: ${metricString},

`

        fs.writeFile(downloadUrl, outputData, (err) => {
            if(err) {
                console.error("Error writing file: ", err);
            } else {
                console.log(`File saved successfully at ${downloadUrl}`);
            }
        })
    } catch (error) {
        console.error('Error occurred while exporting the output: ', error);
        process.exit(1);
    }
}