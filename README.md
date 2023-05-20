## About this project

This project is powered🚀 by `create-node-cli`, and its project site: https://www.npmjs.com/package/create-node-cli

## Install npm dependency

You can install npm dependencies & do npm link by running these code:

```bash
npm install
npm link
```

## How to run

Type in `opendigger -r` and it will return the fork number & star number of github repository https://github.com/X-lab2017/oss101

If you want to explore an another repo, just type in `opendigger -r [author/repo_name]` to get the information. Here `-r` indicates a following of repository url.

For example, you can try with typing in `opendigger -r bruce-jay/bruce-jay` and it will return information of https://github.com/bruce-jay/bruce-jay.

## 2023/05/20

Added download function.

Type in `opendigger -r [author/repo_name] -d` to export the result to local file! The path is `./output/author/repo_name.txt`

More features coming soon~