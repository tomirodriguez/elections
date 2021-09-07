// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const regions = require("../../../../api-elecciones/utils/regionsParser");
const token = require("../../../../api-elecciones/utils/getToken");
const ApiFetcher = require("../../../../api-elecciones/utils/axios").ApiFetcher;
import Cors from 'cors';

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(req, res) {

  await runMiddleware(req, res, cors)

  const { categoryId } = req.query;

  // Chequear si esta en base de datos. Si no esta, pedirlo
  const tokenResponse = await token.getToken();
  const fetcher = new ApiFetcher(tokenResponse);
  const regionsByCategory = await regions.getRegionsByCategeory(fetcher);
  // Guardar en base de datos

  const regionByCategory = regionsByCategory.find(
    (category) => category.code === categoryId
  );

  const flatRegions = [];

  flatRegions.push({ code: '99', name: 'Argentina' });

  regionByCategory.country.districts.forEach(district => {
    flatRegions.push({ code: district.code, name: district.name })
    district.sections.forEach(section => {
      flatRegions.push({ code: district.code + section.code, name: section.name })
      section.towns.forEach(town => {
        flatRegions.push({ code: district.code + section.code + town.code, name: town.name })
      })
    })
  })

  const response = {
    categoryId,
    regions: flatRegions
  }

  res.status(200).json({
    error: false,
    message: "Data successfully fetched!",
    response
  });
}
