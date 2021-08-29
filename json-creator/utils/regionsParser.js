const fileReader = require("./fileReader");
const fileWriter = require("./fileWriter");

const regionsMap = new Map();
const regionsArray = [];

const storeLine = (line) => {
  if (line[0].length <= 7 && parseInt(line[0]) !== 0) {
    regionsArray.push({ code: line[0], name: line[1] });
  }
};

const resolveMap = (resolve) => {
  const regions = regionsArray.filter((region) => region.code.length <= 3);
  regions.forEach((province) =>
    regionsMap.set(province.code, { name: province.name, districts: [] })
  );

  const districts = regionsArray.filter((region) => region.code.length >= 4);
  districts.forEach((district) => {
    const provinceCode = district.code.slice(0, 2);
    regionsMap
      .get(provinceCode)
      .districts.push({ code: district.code, name: district.name });
  });

  resolve(regionsMap);
};

const getRegions = () => {
  return new Promise((resolve, reject) => {
    fileReader.readFile("descripcion_regiones.dsv", storeLine, () =>
      resolveMap(resolve)
    );
  });
};

const createRegionsFile = async () => {
  const regionsMap = await getRegions();
  const mapToArray = Array.from(regionsMap).sort(
    (a, b) => parseInt(a[0]) - parseInt(b[0])
  );

  const arrayToStore = mapToArray.map((entry) => {
    return {
      code: entry[0],
      name: entry[1].name,
      districts: entry[1].districts,
    };
  });

  fileWriter.writeFile("regions", arrayToStore);

  return regionsMap;
};

exports.createRegionsFile = createRegionsFile;
