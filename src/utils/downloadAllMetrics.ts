const fs = require('fs');

// 原来想在这里实现写入文件，发现不可行，因为有太多键值，无法一一取出，所以这里就做一个文件写入是否合法检测吧！
// 同时，因为我们 for 循环里面写入只能 append 所以每次生成一个新的文件需要先清空
export async function downloadAllMetrics(data: any, time: any) {
    const outputFolderPath = `./output/${data.repo_author}/`;
    const downloadUrl = outputFolderPath + `${data.repo_name}-${time}.txt`;

    try {
        // 判断 output 文件夹是否存在，如果不存在则创建
        if (!fs.existsSync(outputFolderPath)) {
            try {
                fs.mkdirSync(outputFolderPath, { recursive: true });
                console.log(`Created ${outputFolderPath} directory successfully.`);
            } catch (error) {
                console.error(`Error occurred while creating ${outputFolderPath} directory:`, error);
            }
        } 

        // 如果要写入的文件不存在，就创建一个
        if (!fs.existsSync(downloadUrl)) {
            try {
            fs.writeFileSync(downloadUrl, '');
            console.log(`Created ${data.repo_name}.txt file successfully.`);
            } catch (error) {
            console.error(`Error occurred while creating ${data.repo_name}.txt file:`, error);
            }
        } else {
            // 清空文件
            fs.truncate(downloadUrl, 0, (err: any) => {
                if(err) {
                    console.error('Error cleaning files:', err)
                }
            })
        }

        
        const outputData = 
`selected_time: ${time},
repo_name: ${data.repo_name},
repo_url: ${data.repo_url},
forks: ${data.content.forks_count},
stars: ${data.content.stargazers_count},
`

        fs.writeFile(downloadUrl, outputData, (err: any) => {
            if(err) {
                console.error("Error writing file: ", err);
            } else {
                console.log(`File saved successfully at ${downloadUrl}`)
            }
        })

        
        return downloadUrl;

    } catch (error) {
        console.error('Error occurred while exporting the output: ', error);
        process.exit(1);
    }
}