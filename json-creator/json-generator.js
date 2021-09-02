const regions = require("./utils/regionsParser");
const categories = require("./utils/candidatesParser");

const start = async () => {
  const regionsMap = await regions.createRegionsFile();

  const categoriesMap = await categories.createCategoriesFile();

  const candidatesCategories = Object.getOwnPropertyNames(categoriesMap)

  candidatesCategories.forEach(category => {
    categoriesMap[category]
  })
};

start();
