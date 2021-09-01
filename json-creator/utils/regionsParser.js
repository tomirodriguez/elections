const fileReader = require("./fileReader");
const fileWriter = require("./fileWriter");

const regionsMap = new Map();
const regionsArray = [];

const storeLine = (line) => {
  if (parseInt(line[0]) <= 999999) {
    regionsArray.push({ code: line[0], name: line[1] });
  }
};

const resolveMap = (resolve) => {
  const country = regionsArray.find((region) => parseInt(region.code) === 0);

  const regionsTree = { ...country, inside: [] };

  const provinces = regionsArray.filter(
    (region) => parseInt(region.code) > 0 && parseInt(region.code) < 1000
  );

  provinces.forEach((province) => {
    regionsTree.inside.push({ ...province, inside: [] });
  });

  const districts = regionsArray.filter(
    (region) => parseInt(region.code) >= 1000
  );

  districts.forEach((district) => {
    const provinceCode = district.code.substring(0, 2);

    const newDistrict = {
      code: district.code.substring(2, 5),
      name: district.name,
    };

    const province = regionsTree.inside.find(
      (province) => province.code === provinceCode
    );

    province.inside.push(newDistrict);
  });

  resolve(regionsTree);
};

const getRegions = () => {
  return new Promise((resolve, reject) => {
    fileReader.readFile("descripcion_regiones.dsv", storeLine, () =>
      resolveMap(resolve)
    );
  });
};

const createRegionsFile = async () => {
  const regions = await getRegions();

  fileWriter.writeFile("regions", regions);

  return regions;
};

exports.createRegionsFile = createRegionsFile;
