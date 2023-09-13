# Opensoda-Cli   ![](https://img.shields.io/badge/License-MIT-blue) ![](https://img.shields.io/badge/Node-v18.17.0-blue) ![](https://img.shields.io/badge/pnpm-v8.6.12-orange) [![](https://img.shields.io/badge/English-purple)](README.md)

本项目由 **LazyAnalysis** 团队开发，该项目是 [Opendigger](https://competition.atomgit.com/competitionInfo?id=bc6603e0b8bf11ed804e6b78b4426d45) 大赛决赛作品。

![LazyAnalysis](LazyAnalysis.png)

## 关于本项目

本项目是一个命令行工具。为了更好地观测热门开源项目的指标，让人们更好地了解一些项目的趋势，X-lab2017 组织整理出了一份数据清单，包含了各种围绕 github 仓库制定的指标。这些指标都可以在 https://github.com/X-lab2017/open-digger 的 README 文件中查看到。本项目利用 X-lab2017 提供的 api，只要提供仓库名称，就可以通过 https://oss.x-lab.info/open_digger/github/${repository}/ 查询。非常有幸得到了这些数据，我们才能得以顺利地开发本项目。

本项目的部分功能由🚀  `create-node-cli` 提供。感谢这个项目为本项目提供了原始框架。

如果需要顺利地运行本项目，需要您的 node 版本大于或等于 18.17。不过不用担心，我们会把项目打包成 docker 并且发布的。

## 如何运行

如果您通过 git clone 源代码运行本项目，感受该命令行工具的强大力量的时候，请先运行：

```
npm install
npm link
```

安装相关的依赖并且链接到全局。

### 基本命令

运行 `opendigger -r=[author/repo_name] -m=[metric]` 获取某个仓库的特定指标值。

例如，运行 `opendigger -r=X-lab2017/oss101 -m=openrank` 就可以获取 X-lab2017 所有的 oss101 仓库的 openrank 指标值。

```
$ opendigger -r=X-lab2017/oss101 -m=openrank

Opensoda-Cli  v1.0.2 by LazyAnalysis
Opendigger cli research tool

repo.name: oss101
repo.url: https://github.com/X-lab2017/oss101
仓库 "X-lab2017/oss101" 的 fork 数: 154, 和 star 数: 90
需要查询的metric openrank 为:  {"2023-02":2.63,"2023-03":18.37,"2023-04":25.21,"2023-05":41.55,"2023-06":26.66,"2023-07":19.22,"2023-08":16.34}
```

可以看到，它返回了从 2023-02 到 2023-08 的所有 openrank 值。

您也可以通过指定时间来查询，比如我需要查询 2023-08 的 openrank 值，只需要加上 -t 选项即可。

```
$ opendigger -r=X-lab2017/oss101 -m=openrank -t=2023-08

Opensoda-Cli  v1.0.2 by LazyAnalysis
Opendigger cli research tool

repo.name: oss101
repo.url: https://github.com/X-lab2017/oss101
仓库 "X-lab2017/oss101" 的 fork 数: 154, 和 star 数: 90
需要查询的metric openrank 为:  {"2023-02":2.63,"2023-03":18.37,"2023-04":25.21,"2023-05":41.55,"2023-06":26.66,"2023-07":19.22,"2023-08":16.34}
在特定时间 2023-08 查询的 openrank 是 16.34
```

此外，也可以加上 `-d` 选项来选择是否导出到本地。导出目录在 `./output` 下

选项汇总

| 选项含义           | 短选项 | 长选项       | 后接参数                                                     |
| ------------------ | ------ | ------------ | ------------------------------------------------------------ |
| 查询指定仓库       | -r     | --repository | 仓库名称，需要加上作者名。如 X-lab2017/oss101                |
| 查询指定指标       | -m     | --metric     | [opendigger](https://github.com/X-lab2017/open-digger) 提供的指标值 |
| 查询特定时间的结果 | -t     | --time       | 需要查询的时间                                               |
| 是否导出到本地     | -d     | --download   | 不需要跟参数                                                 |

项目仍在迭代更新中~
