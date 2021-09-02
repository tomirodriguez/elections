const axios = require("./axios").axios;

class Region {
  constructor(regionLine) {
    const splittedLine = regionLine.split(";");
    this.category = splittedLine[0];
    this.district = splittedLine[1];
    this.section = splittedLine[2];
    this.town = splittedLine[3];
    this.name = splittedLine[4].trim();
  }
}

const getRegionsByCategeory = async (fetcher) => {
  return await fetcher.get("catalogo/csv/getAmbitos").then((response) => {
    const splitted = response.data.split("\r\n");
    const categories = [];

    splitted.forEach((line) => {
      if (line.trim() === "") return;

      const region = new Region(line);

      let currentCategory;
      let currentDistrict;
      let currentSection;
      let currentTown;

      currentCategory = categories.find(
        (category) => category.code === region.category
      );

      // Agrego la categoria si no existe
      if (!currentCategory) {
        currentCategory = {
          code: region.category,
          country: {
            code: region.district,
            name: "",
            districts: [],
          },
        };
        categories.push(currentCategory);
      }

      // Si es Argentina
      if (region.district === "99") {
        currentCategory.country.name = region.name;
        return;
      }

      // Busco el distrito en el pais bajo la categoria
      currentDistrict = currentCategory.country.districts.find(
        (district) => district.code === region.district
      );

      if (!currentDistrict) {
        currentDistrict = {
          code: region.district,
          name: "",
          sections: [],
        };
        currentCategory.country.districts.push(currentDistrict);
      }

      // Si es una provincia, le pongo el nombre y salgo
      if (region.section === "999") {
        currentDistrict.name = region.name;
        return;
      }

      currentSection = currentDistrict.sections.find(
        (section) => section.code === region.section
      );

      if (!currentSection) {
        currentSection = {
          code: region.section,
          name: "",
          towns: [],
        };
        currentDistrict.sections.push(currentSection);
      }

      // Si es una seccion, le pongo el nombre y salgo
      if (region.town === "999") {
        currentSection.name = region.name;
        return;
      }

      currentTown = currentSection.towns.find(
        (town) => town.code === region.town
      );

      if (!currentTown) {
        currentTown = {
          code: region.town,
          name: region.name,
        };
        currentSection.towns.push(currentTown);
      }
    });

    return categories;
  });
};

exports.getRegionsByCategeory = getRegionsByCategeory;
