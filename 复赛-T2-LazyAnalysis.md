# LazyAnalysis-T2-命令行交互的指标结果查询子模块
## 这个项目是什么

该项目是一个基于 `create-node-cli` 构建的 cli 工具，如果想深入了解这个工具，可以点击链接进行探索和研究。

我们已经做了一个 demo，项目的 github 地址: https://github.com/Bruce-Jay/Opensoda-Cli/tree/master 如果直接 clone 仓库安装，需要运行 `npm install && npm link` 安装依赖并且应用到全局。

项目所用的技术栈: Javascript, node version >= v16.17

项目的 npm 地址 https://www.npmjs.com/package/opensoda-cli 之前发布了，但是好像在 npm 里面
搜索还没有显示出来，准备过一段时间再看。反正至少可以根据 github 安装。 这是一个说明文档。同时我在 github 上面的 README 文件可以作为该文档的补充(不过不多，就是开
发的一个时间记录)。

<img width="788" alt="image" src="https://github.com/Bruce-Jay/Opensoda-Cli/assets/90242019/2af19d9e-c28e-4b90-a09d-3b7a5fc93448">

## 项目的结构和主要功能

```
Opensoda-Cli
├── README.md
├── index.js # main class 所在的文件
├── output # 这个文件夹下存储导出的文件
│   └── X-lab2017 # 一级子目录，代表仓库的作者
│       └── oss101.txt # 下属文件名称为仓库名称，文件类型为 txt 
├── package-lock.json
├── package.json
├── templates # 存储项目的组件代码模板 
│   └── ExampleComponent.js
└── utils
    ├── cli.js # 定义有关参数
    ├── downloadResult.js # 将程序的输出导出到本地
    ├── downloadAllMetrics.js # 用于把指定时间内所有的指标导出到本地 ├── getGithubRepo.js # 查询仓库有关信息
    ├── getMetric.js # 用于获取某一个指标的值
    ├── getAllMetrics.js # 用于获取某个仓库的所有指标
    ├── init.js # 项目的初始化信息
    └── log.js # 日志配置文件
```

目前我们的工具已经实现了两个主要功能:查找指定仓库的信息以及导出项目到本地。

## 参数 `-r` 或者 `--repository` 查询指定仓库的信息 
## 参数 `-d` 或者 `--download` 表示导出到本地
## 参数 `-m` 或者 `--metric` 查找对应的指标值
输入 `opendigger -r [author/repo_name] -m [metric]` 查找相应的指标值，比如 openrank,
activity 等等。具体的指标可以在 https://github.com/X-lab2017/open-digger/ 的 readme 里面找到 
## 参数 `-t` 或者 `--time` 指定查找时间
输入 `opendigger -r X-lab2017/oss101 -t 2023-04 -m activity -d` 查找 2023-04 月份该仓库的 activity 信息并且进行下载。

## 运行示例 

**输入参数**以后，选择保存或者不保存:

保存:

<img width="787" alt="image" src="https://github.com/Bruce-Jay/Opensoda-Cli/assets/90242019/62cfdea7-d250-4a01-ad0f-406ca8c06fb7">

不保存:

<img width="786" alt="image" src="https://github.com/Bruce-Jay/Opensoda-Cli/assets/90242019/59083db2-7007-4f08-ae42-4a06ba8ce322">

保存之后会提示输出在哪个文件。

输入参数与时间，在这里我没有设置保存选项。

因为每多一个参数所对应的保存文件就需要大修改，也就是说，每增加一个参数就需要新增一个方法来
保存。虽然说把命令行的输出重定向到文件里面也不是不行，但是这样会导致乱序，而我们输出的信息
是有重要性次序的，比如仓库名、仓库链接必须得放在最前面。本人代码水平尚待提高，所以目前先弄
了一个比较臃肿不过用起来还可以的代码命令行工具。

<img width="788" alt="image" src="https://github.com/Bruce-Jay/Opensoda-Cli/assets/90242019/19c5ba32-8942-4d5c-aaeb-c0e686d24928">

只输入时间保存该时间所对应仓库的所有指标。当然其实不是所有，因为我删去了一些，后面细讲。 

不保存:信息全部在命令行输出

<img width="783" alt="image" src="https://github.com/Bruce-Jay/Opensoda-Cli/assets/90242019/7f324b23-0bbd-408a-bc63-3d00e20d79fa">

保存，命令行相对简洁干净，同时有信息提示保存成功:

<img width="790" alt="image" src="https://github.com/Bruce-Jay/Opensoda-Cli/assets/90242019/8cf1c43f-93af-429e-ad83-b5ab51f315ff">

## 为什么我会去掉某些指标?

如图所示，我把一些指标打印出来以后发现，其键是 avg，levels等等，而不是代表时间的 2023-02, 2023-03 等等。遂去除。并且我认为这些指标也显示不出来，这些指标意义也不是很直观，不如先删去，取其精华。

<img width="390" alt="image" src="https://github.com/Bruce-Jay/Opensoda-Cli/assets/90242019/e21ee5f7-c0f6-48d4-97eb-517d98705d35">

删除的指标总共有:change_request_response_time, change_request_resolution_duration, change_request_age, issue_response_time, issue_resolution_duration, issue_age.

## 后续展望

后续参赛打算新增加几个功能:

- 如果输入两个仓库的地址，从不同角度对比它们，并将它们的优势方面用颜色标识;如果输入一个含有多个仓库的列表，则进行多个仓库的数据分析对比。 
- 支持查询项目的最有影响力的贡献者，并且支持查询他们的 commit 数以及 pull request 数目等等 
- 其他有需要增加的查询指标可以借鉴百度之前举办的飞桨黑客松比赛的开源代码:https://github.com/PaddlePaddle/community/blob/master/reports/insight/insight 根据参赛者作开源社区分析对比的角度，适当地增加功能。



