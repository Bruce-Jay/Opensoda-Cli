# Opensoda-Cli   ![](https://img.shields.io/badge/License-MIT-blue) ![](https://img.shields.io/badge/Node-v18.17.0-blue) ![](https://img.shields.io/badge/pnpm-v8.6.12-orange) [![](https://img.shields.io/badge/%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-green)]()

This tool is developed by **LazyAnalysis** group in [Opendigger](https://competition.atomgit.com/competitionInfo?id=bc6603e0b8bf11ed804e6b78b4426d45) competition.

![LazyAnalysis](LazyAnalysis.png)

## About this project

A terminal tool to have a easy view of metrics of popular github repositories. Api in this tool supported by `X-lab2017`.

This project is powered🚀 by `create-node-cli`, and its project site: https://www.npmjs.com/package/create-node-cli

Language: mostly English but some Chinese

Node version: 18.17.0

## Install npm dependency

If you want to run this project by downloading the source code, please install npm dependencies first.

You can install npm dependencies & do npm link by running these code:

```bash
npm install
npm link
```

## How to run

Type in `opendigger -r X-lab2017/oss101 -m openrank` and it will return the fork number, star number, and openrank value of github repository https://github.com/X-lab2017/oss101

If you want to explore an another repo, just type in `opendigger -r [author/repo_name] -m openrank` to get the information. Here `-r` indicates a following of repository url, `-m` indicates the metric to be used. For more information of metric, please see README.md file at https://github.com/X-lab2017/open-digger. Hopefully you will be excited at the wonderful world.

You can also export your result to local, just to add `-d` choice. Have a try of `opendigger -r X-lab2017/oss101 -m activity -d`, the result will be stored at `.output/[author/repo_name].txt`

You can also specify a time to search one metric at which time. This command `opendigger -r X-lab2017/oss101 -t 2023-04 -m activity -d` will return the `activity` metric of repository `X-lab2017/oss101` in `2023-04`, and then download the results to your local. You can also search all metrics at which time, just without specifying metric argument. Try command `opendigger -r X-lab2017/oss101 -t 2023-04 -d`, the result will be very exciting!

Searching all metrics without specifying time is not supported now, because the output is too large and hand to read.

## 2023/06/29

Support searching for many metrics.

Type in `opendigger -r [author/repo_name] -m [metric]` to explore the metrics of a repo! To specify a time, you can also add a -t argument. For example, type in `opendigger -r X-lab2017/oss101 -t 2023-04 -m activity -d` to have a try!

To explore all metrics, please see README.md file at https://github.com/X-lab2017/open-digger. And I'm very appreciated of you to contribute to it!

You can also type in `opendigger -r [author/repo_name] -t [time]` to see all metrics in one period. But you can't get result with only `opendigger -r [author/repo_name]` now, because the data is too much.

## 2023/05/20

Added download function.

Type in `opendigger -r [author/repo_name] -d` to export the result to local file! The path is `./output/author/repo_name.txt`


More features are coming soon~