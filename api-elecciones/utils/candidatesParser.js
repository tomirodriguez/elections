const axios = require("./axios").axios;

class List {
  constructor(regionLine) {
    const splittedLine = regionLine.split(";");
    this.category = splittedLine[0];
    this.district = splittedLine[1];
    this.agrupationCode = splittedLine[2];
    this.agrupationName = splittedLine[3].trim();
    this.listCode = splittedLine[4];
    this.listName = splittedLine[5].trim();
  }
}

const getCandidatesByCategeory = async () => {
  return await axios
    .get("catalogo/csv/getAgrupacionesListas")
    .then((response) => {
      const splitted = response.data.split("\r\n");
      const categories = [];

      splitted.forEach((line) => {
        if (line.trim() === "") return;

        const list = new List(line);

        let currentCategory;
        let currentDistrict;
        let currentAgrupation;
        let currentList;

        currentCategory = categories.find(
          (category) => category.code === list.category
        );

        //   // Agrego la categoria si no existe
        if (!currentCategory) {
          currentCategory = {
            code: list.category,
            districts: [],
          };
          categories.push(currentCategory);
        }

        // Busco el distrito en el pais bajo la categoria
        currentDistrict = currentCategory.districts.find(
          (district) => district.code === list.district
        );

        if (!currentDistrict) {
          currentDistrict = {
            code: list.district,
            agrupations: [],
          };
          currentCategory.districts.push(currentDistrict);
        }

        currentAgrupation = currentDistrict.agrupations.find(
          (agrupation) => agrupation.code === list.agrupationName
        );

        if (!currentAgrupation) {
          currentAgrupation = {
            code: list.agrupationCode,
            name: list.agrupationName,
            lists: [],
          };
          currentDistrict.agrupations.push(currentAgrupation);
        }

        currentList = currentAgrupation.lists.find(
          (list) => list.code === list.listCode
        );

        if (!currentList) {
          currentList = {
            code: list.listCode,
            name: list.listName,
          };
          currentAgrupation.lists.push(currentList);
        }
      });

      return categories;
    });
};

exports.getCandidatesByCategeory = getCandidatesByCategeory;
