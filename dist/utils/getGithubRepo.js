"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGithubRepo = void 0;
function getGithubRepo(repository) {
    const repo_author = repository.split('/')[0];
    const repo_name = repository.split('/')[1];
    const data = {
        repo_author: repo_author,
        repo_name: repo_name,
        repo_url: `https://github.com/${repository}\n`
    };
    const dataString = `repo_author: ${repo_author}\n` +
        `repo_name: ${repo_name}\n` +
        `repo_url: https://github.com/${repository}\n`;
    return { data, dataString };
}
exports.getGithubRepo = getGithubRepo;
