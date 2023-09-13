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
const downloadAllMetrics_1 = require("./utils/downloadAllMetrics");
const getMetric_1 = require("./utils/getMetric");
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
        .options({ 'r': {
            alias: 'repository',
            demand: true,
            describe: '指定查询的仓库，默认为 X-lab2017/oss101',
            type: 'string'
        }, 'd': {
            alias: 'download',
            demand: false,
            describe: '是否将结果导出，输入此选择，即为true',
            type: 'boolean'
        }, 'm': {
            alias: 'metric',
            demand: false,
            describe: '是否查询特殊的metric，默认为openrank',
            type: 'string'
        }, 't': {
            alias: 'time',
            demand: false,
            describe: '输入需要查询的时间',
            type: 'string'
        }
    }).help('h')
        .alias('h', 'help')
        .usage('Usage: opendigger [options]')
        .example('opendigger -r X-lab2017/oss101 -d -m openrank -t 2020-01-01', '查询 X-lab2017/oss101 仓库在 2020-01-01 的 openrank 值，并将结果导出到 ./output 文件夹下')
        .epilog('copyright 2023')
        .argv;
    // console.log('argvr', argv.r)
    if (argv.r) {
        // 是否填写仓库名，如果没有填写直接不操作，节约计算资源
        let data = yield (0, getGithubRepo_1.getGithubRepo)(argv.r);
        // 打印仓库信息
        console.log(`repo.name: ${data.repo_name}`);
        console.log(`repo.url: ${data.repo_url}`);
        console.log(`仓库 "${argv.r}" 的 fork 数: ${data.content.forks_count}, 和 star 数: ${data.content.stargazers_count}`);
        // 如果 metric 为真，就查询相应的 metric
        if (argv.m) {
            // 为什么innerMetricData取首个下标，因为外面还套了一层花括号
            const metricData = yield (0, getMetric_1.getMetric)(argv.r, argv.m);
            const innerMetricData = Object.values(metricData)[0];
            // 把两个 data 合并, 因为后面需要下载
            data = Object.assign(data, metricData);
            // console.log(data)
            const metricString = JSON.stringify(innerMetricData);
            // 打印所查询的指标值
            console.log(`需要查询的metric ${argv.m} 为: `, metricString);
            // 如果 time 为真，查询相应 time 对应的 metric 值
            if (argv.t) {
                const time = argv.t;
                const value = innerMetricData[time];
                if (value) {
                    console.log(`在特定时间 ${time} 查询的 ${argv.m} 是 ${value}`);
                }
                else {
                    console.log(`没有找到对应 ${time} 的值`);
                }
            }
            else {
                // 如果 download 为真，将其下载到 ./output 的一个文件下
                if (argv.d) {
                    try {
                        yield (0, downloadResult_1.downloadResult)(data, argv);
                    }
                    catch (error) {
                        console.error('Error occurred while exporting the output: ', error);
                        process.exit(1);
                    }
                }
            }
        }
        else {
            if (argv.t) {
                const allMetrics = yield getAllMetrics(argv.r);
                const time = argv.t;
                console.log(`selected_time: ${time}`);
                // 不能在 for 循环里面用否则会乱
                const downloadUrl = yield (0, downloadAllMetrics_1.downloadAllMetrics)(data, time);
                // 由于返回的是一个数组，所以我们需要逐个将其解析出来
                for (const eachMetric of allMetrics) {
                    // 把两个 data 合并, 因为后面需要下载。其实这里一是为了和以上的 fork 与 star 的输出保持一致，二是方便获取repo link
                    data = Object.assign(data, eachMetric);
                    const innerEachMetric = Object.values(eachMetric)[0];
                    const value = innerEachMetric[time];
                    const key = Object.keys(eachMetric)[0];
                    const kv = `${key}: ${value}`;
                    const kvLine = `${key}: ${value}\n`;
                    const kvString = JSON.stringify(kv);
                    // console.log(`在特定时间 ${time} 查询的 ${key} 是 ${value}`)
                    // 如果 download 为真，将其下载到 ./output 的一个文件下
                    if (argv.d) {
                        try {
                            // 获取文件地址开始写入
                            fs.appendFile(downloadUrl, kvLine, (err) => {
                                if (err) {
                                    console.error("Error writing file: ", err);
                                }
                            });
                        }
                        catch (error) {
                            console.error('Error occurred while exporting the output: ', error);
                            process.exit(1);
                        }
                    }
                    else {
                        // 不保存，直接在控制台上打印
                        console.log(kv);
                    }
                }
                // console.log(data)
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
