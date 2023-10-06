<div align="center">
<h1 >
  <br/>Opensoda-Cli
</h1> 

![](https://img.shields.io/badge/License-MIT-blue) 
![](https://img.shields.io/badge/Node-v18.17.0-blue) 
![](https://img.shields.io/badge/pnpm-v8.6.12-orange) 
[![](https://img.shields.io/badge/%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-green)](README-CN.md)

<div align='left'>

This tool is developed by **LazyAnalysis** group in [Opendigger](https://competition.atomgit.com/competitionInfo?id=bc6603e0b8bf11ed804e6b78b4426d45) competition.

<div align="center">

![LazyAnalysis](public/LazyAnalysis.png)

<div align='left'>

## About this project

A terminal tool to have a easy view of metrics of popular github repositories. Api in this tool supported by [`X-lab2017`](https://github.com/X-lab2017).

This project is powered🚀 by `create-node-cli`, and its project site: https://www.npmjs.com/package/create-node-cli


Node version: 18.17.0

## Install

This repository uses pnpm as its package manager. Before starting to use it, make sure you have installed pnpm, which can be viewed by command `pnpm -v`, and if pnpm is not installed, just type in `npm i pnpm -g` to install it!

To install this tool, run pnpm install and pnpm link under the sorce code folder.

```bash
pnpm install
pnpm link
```

or you can just install by pnpm:
 ```bash
 pnpm add opensoda-cli
 ```
`npm i opensoda-cli -g` is also ok.

## Usage
Run `opendigger -h` for detail.  

basic usage template:
#### `opendigger -r <author/repo-name> [-m <metric> -t <time> -d]`

examples:

You can get `openranks` of [`X-lab2017/oss101`](https://github.com/X-lab2017/oss101) by typing in terminal:
```bash
opendigger -r X-lab2017/oss101 -m openrank
```
![](/public/cut2.gif)
If you want to explore an another repo, just type in `opendigger -r <author/repo_name> -m openrank` to get the information. Here `-r` indicates a repository url, `-m` indicates the metric to be used. 

**For more information of metrics, please visit** https://github.com/X-lab2017/open-digger#metrics-or-indices-usage. Hopefully you will be excited at the wonderful world. And I'm very appreciated of you to contribute to it!

You can also **export your result to local**, just add `-d` choice. Have a try of 
```bash
opendigger -r X-lab2017/oss101 -m activity -d
```
![](/public/cut1.gif)

the result will be stored at `.output/[author/repo_name].md`

What's more, you can specify a time to search one metric at specific time. This command 
```bash
opendigger -r X-lab2017/oss101 -t 2023-07 -m activity -d
```
will return the `activity` metric of repository `X-lab2017/oss101` in `2023-07`.

Searching all of the metrics at a specific time is supported, just without specifying metric argument. Try command
```bash
opendigger -r X-lab2017/oss101 -t 2023-04 -d
```
the result will be very exciting!
![](/public/cut3.gif)

Searching all metrics without specifying time is not supported now, because the output is too large and hard to read.




More features are coming soon~