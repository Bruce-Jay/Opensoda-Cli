const fs = require('fs');
const path = require('path');

function includesUppercase(str) {
    return /[A-Z]/.test(str)
}

function includesDashOrUnderscore(str) {
    return /-|_/.test(str)
}

function convertToTagReadyString(str) {
    // 1. 假如输入的名称是 mycomponent
    if (!includesUppercase(str) && !includesDashOrUnderscore(str)) {
        console.log('输入的名称不正确，请确认大写字母')
        process.exit(1)
    }

    // 2. 假如输入的名称包含-或者_
    if (includesDashOrUnderscore(str)) {
        return str.split('_').join('-').toLowerCase();
    }

    // 3. 其他格式 MyComponent / myComponent / MyShinyComponent => my-shiny-component
    str = str.replace(/[A-Z]/g, (match) => {
        return "-" + match;
    })

    if (str.startsWith('-')) {
        str = str.substring(1);
    }
    
    return str.toLowerCase()
}

module.exports = async function generateWebComponent(name, destination) {
    // console.log(name, destination);
    // 1. 读取 ../templates/ExampleComponent.js
    fs.readFile(path.join(__dirname, '../templates', 'ExampleComponent.js'), 'utf8',
        (err, data) => { 
            if (err) throw err;
            // console.log(data);

            // 2. 如果没有 ./components 文件夹，需要创建，即导入 destination param
            if (!fs.existsSync(destination)) {
                fs.mkdir(destination, err => {
                    if (err) throw err;
                    console.log(`${destination} already exists`)
                })
            }

            // 3. 在读取到的代码中，将 classname 和 HTML tag 名称改成 name
            let filename;

            if (name.includes('.')) {
                filename = name.split('.')[0];
            } else {
                filename = name;
            }
            const tagName = convertToTagReadyString(filename)

            const componentName = filename.includes('-') ? filename.replace('-', '_') : filename;

            data = data.replace(/ExampleComponent/g, componentName)
                .replace(/example-component/, tagName);

            console.log(data)

            destination = destination.endsWith('/') ? destination.slice(0, -1) : destination;

            name = name.includes('.') ? name : (name + '.js');
            
            console.log(name, destination)

            // 4. 在 components 文件夹里面创建一个新的文件叫 name 然后把它的内容改成模板
            fs.writeFile(`${destination}/${name}`, data, err => {
                if (err) throw err;
                console.log(`已经在 ${destination} 文件夹中创建了一个文件 ${name}`);
            })
        })
    
}