const fs = require('fs');

// 保存 console.log 的输出到文件，如果不为空先清空
function saveLogToFile(log, filePath) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
        fs.writeFileSync(filePath, ''); // 清空文件内容
    }
    fs.appendFile(filePath, log + '\n', (err) => {
        if (err) {
            console.error('Error occurred while saving log to file:', err);
        }
    });
}

// 重定向 console.log 到文件
function redirectConsoleLogToFile(filePath) {
    const originalLog = console.log;
    console.log = function (message) {
        saveLogToFile(message, filePath);
        originalLog.apply(console, arguments);
    };
}

module.exports = async function downloadResult(data) {
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

        redirectConsoleLogToFile(downloadUrl);

        console.log(`repo.name: ${data.repo_name}`);
        console.log(`repo.url: ${data.repo_url}`);
        console.log(`仓库 "${data.repo_author}/${data.repo_name}" 的 fork 数: ${data.content.forks_count}, 和 star 数: ${data.content.stargazers_count}`);

    } catch (error) {
        console.error('Error occurred while exporting the output: ', error);
        process.exit(1);
    }
}