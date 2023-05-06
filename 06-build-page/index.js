const fs = require('fs');
const path = require('path');

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
            (err) => {
              if (err) console.log('Error Found:', err);
              console.log(there);
            }
          );
        }
      }
    
    });
}

function main() {
  createDir(path.join(__dirname, 'project-dist'));
  createDir(path.join(__dirname, 'project-dist', 'assets'));
  copyDir(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets')
  );
  
  
}

main();