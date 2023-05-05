const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });

fs.writeFile(
  path.join(__dirname, 'text.txt'),
  '',
  error => {
    if (error) console.log('Error', error.message);
  }
);

output.write('Hi! Enter some text!\n');

rl.on('line', (line) => {
  if (line.endsWith('exit')) {
    rl.close();
    output.write('Good Bye!\n');
    return;
  }
  fs.appendFile(
    path.join(__dirname, 'text.txt'),
    line + '\n',
    error => {
      if (error) console.log('Error', error.message);
    }
  );
}); 
