const regions = require("./utils/regionsParser");
const candidates = require("./utils/candidatesParser");
const fileWriter = require("./utils/fileWriter");

const start = async () => {
  const regionsByCategory = await regions.getRegionsByCategeory();
  const lists = await candidates.getCandidatesByCategeory();

  fileWriter.writeFile("regionsByCategory", regionsByCategory);
  fileWriter.writeFile("candidatesByCategory", lists);
};

start();
