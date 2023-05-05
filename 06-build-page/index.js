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

function main() {
  createDir(path.join(__dirname, 'project-dist'));
  
}

main();