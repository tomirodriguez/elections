const fs = require("fs");
const path = require("path");
const dataDirectory = path.join(process.cwd(), "api-elecciones/json/");

const writeFile = (fileName, object) => {
  fs.writeFileSync(dataDirectory + `${fileName}.json`, JSON.stringify(object));
};

exports.writeFile = writeFile;
