<div align="center">
<h1 >
  <br/>Opensoda-Cli
</h1> 

![](https://img.shields.io/badge/License-MIT-blue) 
![](https://img.shields.io/badge/Node-v18.17.0-blue) 
![](https://img.shields.io/badge/pnpm-v8.6.12-orange) 
[![](https://img.shields.io/badge/English-green)](README.md)

<div align='left'>

本项目由 **LazyAnalysis** 团队开发，该项目是 [Opendigger](https://competition.atomgit.com/competitionInfo?id=bc6603e0b8bf11ed804e6b78b4426d45) 大赛决赛作品。

<div align="center">

![LazyAnalysis](public/LazyAnalysis.png)

<div align='left'>

## 关于本项目

本项目是一个命令行工具。为了更好地观测热门开源项目的指标，让人们更好地了解一些项目的趋势，X-lab2017 组织整理出了一份数据清单，包含了各种围绕 github 仓库制定的指标。这些指标都可以在 https://github.com/X-lab2017/open-digger 的 README 文件中查看到。本项目利用 X-lab2017 提供的 api，只要提供仓库名称，就可以通过 https://oss.x-lab.info/open_digger/github/${repository}/ 查询。非常有幸得到了这些数据，我们才能得以顺利地开发本项目。

本项目的部分功能由🚀  `create-node-cli` 提供。感谢这个项目为本项目提供了原始框架。

如果需要顺利地运行本项目，需要您的 node 版本大于或等于 18.17。不过不用担心，我们会把项目打包成 docker 并且发布的。

## 安装

此项目使用pnpm作为包管理工具。在开始之前，确保您已经安装了pnpm, 您可以通过执行`pnpm -v`命令来查看是否已经安装。如果没有安装，执行  `npm i pnpm -g` 即可安装！

在该项目文件夹下，运行`pnpm install` 和 `pnpm link .`，即可安装opensoda-cli.

```bash
pnpm install
npm link 
```

或者，你可以直接通过pnpm安装：
 ```bash
 pnpm add opensoda-cli
 ```

`npm i opensoda-cli -g` 也可以。

### 使用

> 运行 `opendigger -r` 获取功能细节。

基本使用模板：
#### `opendigger -r <author/repo-name> [-m <metric> -t <time> -d]`

例子：

你可以在终端运行以下命令，获得[`X-lab2017/oss101`](https://github.com/X-lab2017/oss101)的`openrank`值：
```bash
opendigger -r X-lab2017/oss101 -m openrank
```
![](/public/cut2.gif)

如果想要查询其他仓库，运行`opendigger -r <author/repo_name> -m openrank`就可以了。这里`-r`表示仓库地址，`-m`表示要查询的指标。

更多指标，请移步https://github.com/X-lab2017/open-digger#metrics-or-indices-usage。

你也可以加上`-d`选项，来将结果导出。

试试以下命令：
```bash
opendigger -r X-lab2017/oss101 -m activity -d
```
![](/public/cut1.gif)

结果会保存在 `.opendigger-output/[author/repo_name].md`。

你还可以指定查询时间，查询特定时间的指标。这条指令：
```bash
opendigger -r X-lab2017/oss101 -t 2023-07 -m activity -d
```

将返回仓库`X-lab2017/oss101`2023年7月的`activity`值。

这款工具还支持查询同一时间的的所有指标，只要不指定`-m`即可。尝试以下指令：

```bash
opendigger -r X-lab2017/oss101 -t 2023-04 -d
```
![](/public/cut3.gif)

考虑到输出太大，查询所有时间的所有指标暂时不支持。

项目仍在迭代更新中~
