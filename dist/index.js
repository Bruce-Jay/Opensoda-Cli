#!/usr/bin/env node
"use strict";
/**
 * test-cli
 * Opendigger cli research tool
 *
 * @author Yiren Lin <https://github.com/bruce-jay>
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
// const getGithubRepo = require('./utils/getGithubRepo');
const getGithubRepo_1 = require("./utils/getGithubRepo");
const downloadResult_1 = require("./utils/downloadResult");
const commonUtils_1 = require("./utils/commonUtils");
const getAllMetrics = require('./utils/getAllMetrics');
const { program } = require('commander');
const { execSync } = require('child_process');
const fs = require('fs');
// 引入 axios 库，用于发送 HTTP 请求
const axios = require('axios');
const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;
(() => __awaiter(void 0, void 0, void 0, function* () {
    init({ clear });
    input.includes(`help`) && cli.showHelp(0);
    const argv = require('yargs/yargs')(process.argv.slice(2))
        .options({
        r: {
            alias: 'repository',
            demand: true,
            describe: '指定查询的仓库，默认为 X-lab2017/oss101',
            type: 'string'
        },
        d: {
            alias: 'download',
            demand: false,
            describe: '是否将结果导出，输入此选择，即为true',
            type: 'boolean'
        },
        m: {
            alias: 'metric',
            demand: false,
            describe: '是否查询特殊的metric，默认为openrank',
            type: 'string'
        },
        t: {
            alias: 'time',
            demand: false,
            describe: '输入需要查询的时间',
            type: 'string'
        }
    })
        .help('h')
        .alias('h', 'help')
        .usage('Usage: opendigger [options]')
        .example('opendigger -r X-lab2017/oss101 -d -m openrank -t 2020-01-01', '查询 X-lab2017/oss101 仓库在 2020-01-01 的 openrank 值，并将结果导出到 ./output 文件夹下')
        .epilog('copyright 2023').argv;
    // console.log('argvr', argv.r)
    if (argv.r) {
        // 是否填写仓库名，如果没有填写直接不操作，节约计算资源
        let data = yield (0, getGithubRepo_1.getGithubRepo)(argv.r);
        // 打印仓库信息
        (0, commonUtils_1.printRepoInfo)(data, argv);
        // 如果 metric 为真，就查询相应的 metric
        if (argv.m) {
            const metricData = (0, commonUtils_1.printMetricData)(argv);
            data = Object.assign(data, metricData);
            if (argv.t) {
                (0, commonUtils_1.printTimeMetric)(argv.t, argv.m, metricData);
            }
            else {
                // 如果 download 为真，将其下载到 ./output 的一个文件下
                if (argv.d) {
                    yield (0, downloadResult_1.downloadResult)(data, argv);
                }
            }
        }
        else {
            if (argv.t) {
                (0, commonUtils_1.printAllMetricOneTime)(data, argv);
            }
            else {
                console.log('Too much to print! Please select a time to get more specified info');
            }
        }
    }
    else {
        console.log('Please select a repository.');
    }
    // data_origin 代表 fork star 等可以直接看到的数据，用户可以检验是否获取了正确的仓库信息
}))();