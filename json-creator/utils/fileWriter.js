const fs = require("fs");
const path = require("path");
const dataDirectory = path.join(process.cwd(), "public/data/");

const writeFile = (fileName, object) => {
  fs.writeFileSync(dataDirectory + `${fileName}.json`, JSON.stringify(object));
};

exports.writeFile = writeFile;
