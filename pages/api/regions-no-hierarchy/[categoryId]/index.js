// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const regions = require("../../../../api-elecciones/utils/regionsParser");
const token = require("../../../../api-elecciones/utils/getToken");
const ApiFetcher = require("../../../../api-elecciones/utils/axios").ApiFetcher;

export default async function handler(req, res) {

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