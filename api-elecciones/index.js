const regions = require("./utils/regionsParser");
const candidates = require("./utils/candidatesParser");
const fileWriter = require("./utils/fileWriter");
const token = require("./utils/getToken");
const ApiFetcher = require("./utils/axios").ApiFetcher;

const start = async () => {
  const tokenResponse = await token.getToken();
  const fetcher = new ApiFetcher(tokenResponse);

  const regionsByCategory = await regions.getRegionsByCategeory(fetcher);
  const lists = await candidates.getCandidatesByCategeory(fetcher);

  // fileWriter.writeFile("regionsByCategory", regionsByCategory);
  // fileWriter.writeFile("candidatesByCategory", lists);
};

start();
