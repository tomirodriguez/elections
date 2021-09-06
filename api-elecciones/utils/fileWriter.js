const fs = require("fs");
const path = require("path");
const dataDirectory = path.join(process.cwd(), "api-elecciones/json/");
const publicDirectory = path.join(process.cwd(), "public/data/");

const writeFile = (fileName, object) => {
  fs.writeFileSync(dataDirectory + `${fileName}.json`, JSON.stringify(object));
  fs.writeFileSync(publicDirectory + `${fileName}.json`, JSON.stringify(object));
};

exports.writeFile = writeFile;
