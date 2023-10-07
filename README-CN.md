<div align="center">
<h1 >
  <br/>Opensoda-cli
</h1> 

![](https://img.shields.io/badge/License-MIT-blue) 
![](https://img.shields.io/badge/Node-v18.17.0-blue) 
![](https://img.shields.io/badge/pnpm-v8.6.12-orange) 
[![](https://img.shields.io/badge/English-green)](README.md)

![](public/display.png)

<div align='left'>

本项目由 **LazyAnalysis** 团队开发，该项目是 [Opendigger](https://competition.atomgit.com/competitionInfo?id=bc6603e0b8bf11ed804e6b78b4426d45) 大赛决赛作品。

<div align="center">

![LazyAnalysis](public/LazyAnalysis.png)

<div align='left'>

## 关于本项目

本项目是一个命令行工具。为了更好地观测热门开源项目的指标，让人们更好地了解开源项目的趋势，X-lab2017 组织整理出了一份数据清单，包含了各种围绕 github 仓库制定的指标。这些指标都可以在 https://github.com/X-lab2017/open-digger 的 README 文件中查看到。本项目利用 X-lab2017 提供的 api，只要提供仓库名称，就可以通过 https://oss.x-lab.info/open_digger/github/${repository}/ 查询。非常有幸得到了这些数据，我们才能得以顺利地开发本项目。

本项目的部分功能由🚀  `create-node-cli` 提供。感谢这个项目为本项目提供了原始框架。

如果需要顺利地运行本项目，需要您的 node 版本大于或等于 18.17。不过不用担心，我们会把项目打包成 docker 并且发布的。

为了能够顺利运行本typescript项目，推荐在运行本项目之前另起一个终端运行 `tsc --watch` 来监听项目的变化。如您尚未安装ts, 这需要您运行 `npm install typescript -g` 来安装ts。

## 安装

此项目使用pnpm作为包管理工具。在开始之前，确保您已经安装了pnpm, 您可以通过执行`pnpm -v`命令来查看是否已经安装。如果没有安装，执行  `npm i pnpm -g` 即可安装！

在该项目文件夹下，运行`pnpm install` 和 `npm link`，即可安装opensoda-cli.

```bash
pnpm install
npm link 
```

或者，你可以直接通过npm -g安装：
 ```bash
npm i opensoda-cli -g
 ```


### 使用

> 运行 `opendigger -h` 获取功能细节。

基本使用模板：
#### `opendigger -r <author/repo-name> [-m <metric> -t <time> -d]`

例子：

你可以在终端运行以下命令，获得[`valhalla/valhalla`](https://github.com/valhalla/valhalla)的`openrank`值：
```bash
opendigger -r=valhalla/valhalla -m=openrank
```
![cut1](https://github.com/Bruce-Jay/Opensoda-Cli/assets/90242019/a8cf4a43-b6e2-47b5-bc91-e93c18cc1a93)

如果想要查询其他仓库，运行`opendigger -r <author/repo_name> -m openrank`就可以了。这里`-r`表示仓库地址，`-m`表示要查询的指标。

**更多指标**，请移步https://github.com/X-lab2017/open-digger#metrics-or-indices-usage。

你也可以加上`-d`选项，来将**导出可视化报告**。

试试以下命令：
```bash
opendigger -r=valhalla/valhalla -m=openrank -d
```
![cut2](https://github.com/Bruce-Jay/Opensoda-Cli/assets/90242019/246d9fb6-85d7-432a-927a-0d7678bd8477)

导出的markdown报告包含了所查询的数据以及echarts生成的图片，报告和图片都保存在 `./opendigger-output/`下。

你还可以指定查询时间，查询特定时间的指标。这条指令：
```bash
opendigger -r=valhalla/valhalla -m=openrank -t=2022-10
```
将返回仓库`valhalla/valhalla`2023年7月的`openrank`值，并保存。

![cut3](https://github.com/Bruce-Jay/Opensoda-Cli/assets/90242019/ac37eb6d-ee16-41ee-9a04-67909ec315c1)

这款工具还支持查询同一时间的的所有指标，只要不指定`-m`即可。尝试以下指令：

```bash
opendigger -r=valhalla/valhalla -t=2022-10
```
![cut4](https://github.com/Bruce-Jay/Opensoda-Cli/assets/90242019/f9e0e1df-b188-43b5-9204-05c2bf405b24)

现已支持查询仓库所有指标在所有时间上的值：
```bash
opendigger -r=valhalla/valhalla
```
![cut5](https://github.com/Bruce-Jay/Opensoda-Cli/assets/90242019/0b8a64aa-f66b-4b03-b5b2-ed929bd56ba9)
查询仓库在所有指标上的每月的数值，并导出可视化报告。
```bash
opendigger -r=valhalla/valhalla -d
```
![cut6](https://github.com/Bruce-Jay/Opensoda-Cli/assets/90242019/a4253fc2-da3a-47ef-9dbf-c4b34c011d21)

### 在线体验 😋
为了帮助大家零门槛体验我们的工具，我们用react+antd开发了一个在线体验版的网页。

网页界面如下：
<img width="1393" alt="web" src="https://github.com/Bruce-Jay/Opensoda-Cli/assets/90242019/297780b7-b2a4-41a5-8965-8e865a86ad7b">

本项目仍在迭代更新中~
