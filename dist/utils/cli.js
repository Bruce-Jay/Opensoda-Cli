"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meow = require('meow');
const meowHelp = require('cli-meow-help');
const flags = {
    clear: {
        type: `boolean`,
        default: false,
        alias: `c`,
        desc: `Clear the console`
    },
    noClear: {
        type: `boolean`,
        default: false,
        desc: `Don't clear the console`
    },
    // debug: {
    // 	type: `boolean`,
    // 	default: false,
    // 	alias: `d`,
    // 	desc: `Print debug info`
    // },
    version: {
        type: `boolean`,
        alias: `v`,
        desc: `Print CLI version`
    },
    name: {
        type: 'string',
        default: 'ExampleComponent.js',
        alias: 'n',
        desc: 'Web Component File Name 组件名称'
    },
    destination: {
        type: 'string',
        default: './components',
        alias: 'd',
        desc: ' 组件目标文件夹'
    },
    repository: {
        type: 'string',
        default: 'X-lab2017/oss101',
        alias: 'r',
        desc: ' 需要查询的 github 仓库'
    },
    download: {
        type: 'boolean',
        default: false,
        alias: 'd',
        desc: ' 是否需要导出'
    },
    metric: {
        type: 'string',
        default: 'OpenRank',
        alias: 'm',
        desc: ' 查询使用什么指标'
    },
    metricTrue: {
        type: 'boolean',
        default: false,
        desc: 'metric 是否为真'
    }
};
const commands = {
    help: { desc: `Print help info` }
};
const helpText = meowHelp({
    name: `opendigger`,
    flags,
    commands
});
const options = {
    inferType: true,
    description: false,
    hardRejection: false,
    flags
};
const cli = meow(helpText, options);
exports.default = cli;
