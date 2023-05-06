const fs = require('fs');
const path = require('path');
const { readdir } = fs.promises;

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
      if(error) console.log('Big error', error.message);
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
}

main();