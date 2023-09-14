// const alert = require('cli-alerts');

module.exports = (info: any) => {
	alert({
		type: `warning`,
		name: `DEBUG LOG`,
		msg: ``
	});

	console.log(info);
	console.log();
};
