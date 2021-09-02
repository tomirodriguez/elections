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

  const resultsByRegion = await Promise.all(
    regionByCategory.country.districts.map((region) => {
      return fetcher.get(
        `resultados/getResultados?categoriaId=${categoryId}&distritoId=${region.code}`
      ).then(response => {
        return {
          region: region.code,
          state: response.data
        }
      });
    })
  );

  res.status(200).json({
    error: false,
    message: "Data successfully fetched!",
    response: resultsByRegion,
  });
}
