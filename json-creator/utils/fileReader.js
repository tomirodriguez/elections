const fs = require("fs");
const readline = require("readline");
const path = require("path");
const dataDirectory = path.join(process.cwd(), "data-source");

const line_counter = ((i = 0) => () => ++i)();

const readFile = (fileName, onLine, onEnd) => {
  const fileStream = fs.createReadStream(path.join(dataDirectory, fileName));

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  rl.on("line", (line, lineno = line_counter()) => {
    if (lineno > 1) {
      const splittedLine = line.split("|");
      onLine(splittedLine);
    }
  });

  fileStream.on("end", onEnd);
};

exports.readFile = readFile;
