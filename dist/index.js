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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = __importDefault(require("./utils/init"));
const cli_1 = __importDefault(require("./utils/cli"));
const getGithubRepo_1 = require("./utils/getGithubRepo");
const downloadResult_1 = require("./utils/downloadUtils/downloadResult");
const downloadTimeMetric_1 = require("./utils/downloadUtils/downloadTimeMetric");
const downloadAllMetricsOfOneTime_1 = require("./utils/downloadUtils/downloadAllMetricsOfOneTime");
const downloadAll_1 = require("./utils/downloadUtils/downloadAll");
const commonUtils_1 = require("./utils/commonUtils");
const input = cli_1.default.input;
const flags = cli_1.default.flags;
const { clear, debug } = flags;
module.exports = (() => __awaiter(void 0, void 0, void 0, function* () {
    (0, init_1.default)({ clear });
    input.includes(`help`) && cli_1.default.showHelp(0);
    const argv = require('yargs/yargs')(process.argv.slice(2))
        .options({
        r: {
            alias: 'repository',
            demand: true,
            describe: '指定查询的仓库',
            type: 'string'
        },
        d: {
            alias: 'download',
            demand: false,
            describe: '是否将结果导出，输入此选项，即为 true',
            type: 'boolean'
        },
        m: {
            alias: 'metric',
            demand: false,
            describe: '是否指定 metric 查询',
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
        .example('opendigger -r X-lab2017/oss101 -d -m openrank -t 2023-01', '查询 X-lab2017/oss101 仓库在 2023-01 的 openrank 值，并将结果导出到 ./opendigger-output 文件夹下')
        .epilog('Copyright © 2023 LazyAnasis. All Rights Reserved.').argv;
    // console.log('argvr', argv.r)
    if (argv.r) {
        // 是否填写仓库名，如果没有填写直接不操作，节约计算资源
        let { data, dataString } = (0, getGithubRepo_1.getGithubRepo)(argv.r);
        // 打印仓库信息
        (0, commonUtils_1.printRepoInfo)(data);
        // 如果 metric 为真，就查询相应的 metric
        if (argv.m) {
            const { metricData, metricString } = yield (0, commonUtils_1.printMetricData)(argv);
            dataString += metricString;
            if (argv.t) { // opendigger -r=valhalla/valhalla -m=openrank -t=2023-xx
                (0, commonUtils_1.printTimeMetric)(argv.t, argv.m, metricData);
                if (argv.d) { // opendigger -r=valhalla/valhalla -m=openrank -t=2023-xx -d
                    yield (0, downloadTimeMetric_1.downloadTimeMetric)(data, argv, metricData);
                }
            }
            else {
                // 如果 download 为真，将其下载到 ./output 的一个文件下
                if (argv.d) { // opendigger -r=valhalla/valhalla -m=openrank -d
                    yield (0, downloadResult_1.downloadResult)(data, argv, metricData);
                }
            }
        }
        else {
            if (argv.t) { // opendigger -r=valhalla/valhalla -t=2023-xx
                (0, commonUtils_1.printAllMetricOneTime)(data, argv);
                if (argv.d) { // opendigger -r=valhalla/valhalla -t=2023-xx -d
                    yield (0, downloadAllMetricsOfOneTime_1.downloadAllMetricsOfOneTime)(data, argv);
                }
            }
            else {
                if (argv.d) { // opendigger -r=valhalla/valhalla -d
                    yield (0, downloadAll_1.downloadAll)(data, argv);
                }
                else { // opendigger -r=valhalla/valhalla
                    (0, commonUtils_1.printAllNumberKVMetric)(argv); // 打印所有的数值型 metric
                }
            }
        }
    }
    else {
        console.log('Please select a repository.');
    }
    // data_origin 代表 fork star 等可以直接看到的数据，用户可以检验是否获取了正确的仓库信息
}))();
