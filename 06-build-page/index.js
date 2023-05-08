const fs = require('fs');
const path = require('path');
const { readdir } = fs.promises;
const readline = require('readline');

function findTemplateTags(str) {
  const target = '{{';
  let pos = 0;
  let allPos = [];
  while (target) {
    let foundPos = str.indexOf(target, pos);
    if (foundPos == -1) break;
    allPos.push(foundPos + 2);
    pos = foundPos + 1;
  }

  return allPos;
}

function getTemplateNames(arr, str) {
  let allTemplatesNamesInLine = [];

  for (let pos of arr) {
    let templateName = '';
    while(allTemplatesNamesInLine) {
      if (str[pos] === '}') break;
      templateName += str[pos];
      pos++;
    }
    allTemplatesNamesInLine.push(templateName);
  }

  return allTemplatesNamesInLine;
}

async function copyFileData(files, obj) {
  
  for (const file of files) {
    if (file.name.endsWith('.html') && !file.isDirectory()) {
      let promise = new Promise((resolve, reject) => {
        const input = fs.createReadStream(path.join(__dirname, 'components', `${file.name}`), 'utf-8');
        let data = '';
        input.on('data', chunk => data += chunk);
        input.on('end', () => resolve(data));
        input.on('error', error => reject(error));
      });

      await promise.then(
        result => {
          obj[file.name.slice(0, -5)] = result;
        },
        error => console.log('Error', error.message)
      );
    }
  }

}

async function getComponentsData() {
  const components = {};

  let files = await readdir(
    path.join(__dirname, 'components'),
    {withFileTypes: true},
    error => {
      if (error) console.log('Error', error.message);
    }
  );

  await copyFileData(files, components);

  return components;
} 

function readIndex(components) {
  const input = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  const rl = readline.createInterface({ input, output });

  rl.on('line', line => {
    if (line.endsWith('</html>')) {
      output.write(line);
      rl.close();
      return;
    }

    let templateNames = findTemplateTags(line);

    if (templateNames.length) {
      let arrTemplateNames = getTemplateNames(templateNames, line);

      for (const template of arrTemplateNames) {
        if (template in components) {
          output.write(components[template] + '\n');
        }
      }
    } else {
      output.write(line + '\n');
    }
  }); 
}

function createDir(path) {
  fs.mkdir(
    path,
    { recursive: true },
    error => {
      if (error) console.log(error);
    }
  );
}

function copyDir(fromHere, there) {
  fs.readdir(
    fromHere,
    {withFileTypes: true},
    (error, dirents) => {
      if(error) console.log('Error', error.message);
      for (const dirent of dirents) {
        if (dirent.isDirectory()) {
          createDir(path.join(`${there}`, `${dirent.name}`));
          copyDir(path.join(`${fromHere}`, `${dirent.name}`), path.join(`${there}`, `${dirent.name}`));
        } else {
          fs.copyFile(
            path.join(`${fromHere}`, `${dirent.name}`),
            path.join(`${there}`, `${dirent.name}`),
            error => {
              if (error) console.log('Error', error.message);
            }
          );
        }
      }
    });
}

function createFile(path) {
  fs.writeFile(
    path,
    '',
    error => {
      if (error) console.log('Error', error.message);
    }
  );
}

async function mergeStyleFiles() {
  let files = await readdir(
    path.join(__dirname, 'styles'),
    {withFileTypes: true}
  );

  files = files
    .filter(dirent => dirent.name.endsWith('.css') && !dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const file of files) {
    fs.readFile(
      path.join(__dirname, 'styles', `${file}`),
      'utf-8',
      (error, data) => {
        if (error) console.log('Error', error.message);
        fs.appendFile(
          path.join(__dirname, 'project-dist', 'style.css'),
          data,
          error => {
            if (error) console.log('Error', error.message);
          }
        );
      }
    );
  }
}

function main() {
  createDir(path.join(__dirname, 'project-dist'));
  createDir(path.join(__dirname, 'project-dist', 'assets'));
  copyDir(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets')
  );
  createFile(path.join(__dirname, 'project-dist', 'index.html'));
  createFile(path.join(__dirname, 'project-dist', 'style.css'));
  mergeStyleFiles();
  getComponentsData().then(
    result => readIndex(result),
    error => console.log('Error', error.message)
  );
  
}

main();