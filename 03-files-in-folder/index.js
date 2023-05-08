const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  {withFileTypes: true},
  (error, items) => {
    if (error) console.log('Error', error.message);
    
    const arr = items.filter( item => !item.isDirectory() );

    for (let i = 0; i < arr.length; i++) {
      let infoAboutFile = '';
      const posPoint = arr[i].name.indexOf('.');
      const fileName = arr[i].name.slice(0, posPoint);
      const extFile = path.extname(
        path.join(__dirname, 'secret-folder', `${arr[i].name}`)
      ).slice(1);
      fs.stat(
        path.join(__dirname, 'secret-folder', `${arr[i].name}`),
        (error, stats) => {
          if (error) console.log('Error', error.message);
          infoAboutFile = fileName + ' - ' + extFile + ' - ' + stats['size'];
          console.log(infoAboutFile);
        }
      );
    }
  });