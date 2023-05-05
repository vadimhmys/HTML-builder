const fs = require('fs/promises');
const { readdir } = fs;
const path = require('path');
 
async function copyDir() {
  try {
    fs.mkdir(
      path.join(__dirname, 'files-copy'),
      { recursive: true },
      error => {
        if (error) console.log(error);
      }
    );

    const filesFromDirFiles = await readdir(
      path.join(__dirname, 'files')
    );

    const filesFromDirFilesCopy = await readdir(
      path.join(__dirname, 'files-copy')
    );

    let filesToBeDeleted = [];

    if (filesFromDirFilesCopy.length !== 0) {
      filesToBeDeleted = filesFromDirFilesCopy.filter( file => !filesFromDirFiles.includes(file));

      for (const file of filesToBeDeleted) {
        fs.unlink(
          path.join(__dirname, 'files-copy', `${file}`),
          error => {
            if (error) console.log('Error', error.message);
          }
        );
      }
    }
    
    for (const file of filesFromDirFiles) {
      fs.copyFile(
        path.join(__dirname, 'files', `${file}`),
        path.join(__dirname, 'files-copy', `${file}`)
      );
    }

  } catch (error) {
    console.log('Error', error.message);
  } 
}

copyDir();
