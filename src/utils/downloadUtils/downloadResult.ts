import * as fs from 'fs';

export async function downloadResult(data: any, argv: any, metricString: string) {
	const outputFolderPath = `./opendigger-output/${data.repo_author}/`;
	const downloadUrl = outputFolderPath + `${data.repo_name}-${argv.m}.md`;

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
		} else {
			console.log(`${outputFolderPath} directory already exists.`);
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
		}

		let outputData = `repo_author: ${data.repo_author}\n` +
							`repo_name: ${data.repo_name}\n` +
							`repo_url: ${data.repo_url}\n` + 
							`metric_name: ${argv.m}\n`;
		outputData += metricString;
		

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
