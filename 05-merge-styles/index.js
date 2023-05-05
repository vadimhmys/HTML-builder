const fs = require('fs');
const { readdir } = fs.promises;
const path = require('path');

function createBundleFile() {
  fs.writeFile(
    path.join(__dirname, 'project-dist', 'bundle.css'),
    '',
    error => {
      if (error) console.log('Error', error.message);
    }
  );
}

async function readFileStyles() {
  createBundleFile();

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
          path.join(__dirname, 'project-dist', 'bundle.css'),
          data,
          error => {
            if (error) console.log('Error', error.message);
          }
        );
      }
    );
  }

}

readFileStyles();