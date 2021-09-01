const regions = require("./utils/regionsParser");
const categories = require("./utils/candidatesParser");

const start = async () => {
  const regionsMap = await regions.createRegionsFile();
  console.log("REGIONES TERMINADAS");

  const categoriesMap = await categories.createCategoriesFile();
  console.log("CATEGORIAS TERMINADAS", categoriesMap);

  const candidatesCategories = Object.getOwnPropertyNames(categoriesMap)

  candidatesCategories.forEach(category => {
    categoriesMap[category]
  })
};

start();
