const fs = require('fs');

export function getDownloadPath(data: any, time: any) {
	const outputFolderPath: string = `./output/${data.repo_author}/`;
	const downloadUrl: string = outputFolderPath + `${data.repo_name}-${time}.md`;
	return downloadUrl
}

// 原来想在这里实现写入文件，发现不可行，因为有太多键值，无法一一取出，所以这里就做一个文件写入是否合法检测吧！
// 同时，因为我们 for 循环里面写入只能 append 所以每次生成一个新的文件需要先清空
export async function downloadAllMetrics(data: any, time: any) {
	const outputFolderPath = `./output/${data.repo_author}/`;
	const downloadUrl = outputFolderPath + `${data.repo_name}-${time}.md`;

	try {
		// 判断 output 文件夹是否存在，如果不存在则创建
		if (!fs.existsSync(outputFolderPath)) {
			try {
				fs.mkdirSync(outputFolderPath, { recursive: true });
				console.log(
					`Created ${outputFolderPath} directory successfully.`
				);
			} catch (error) {
				console.error(
					`Error occurred while creating ${outputFolderPath} directory:`,
					error
				);
			}
		}

		// 如果要写入的文件不存在，就创建一个
		if (!fs.existsSync(downloadUrl)) {
			try {
				fs.writeFileSync(downloadUrl, '');
				console.log(`Created ${data.repo_name}.md file successfully.`);
			} catch (error) {
				console.error(
					`Error occurred while creating ${data.repo_name}.md file:`,
					error
				);
			}
		} else {
			// 清空文件
			fs.truncate(downloadUrl, 0, (err: any) => {
				if (err) {
					console.error('Error cleaning files:', err);
				}
			});
		}

		const outputData = `selected_time: ${time},\n` +
							`repo_author: ${data.repo_author},\n` +
							`repo_name: ${data.repo_name},\n` +
							`repo_url: ${data.repo_url},\n`;

		fs.writeFile(downloadUrl, outputData, (err: any) => {
			if (err) {
				console.error('Error writing file: ', err);
			} else {
				console.log(`File saved successfully at ${downloadUrl}`);
			}
		});

	} catch (error) {
		console.error('Error occurred while exporting the output: ', error);
		process.exit(1);
	}
}
