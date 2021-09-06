// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const regions = require("../../../../../api-elecciones/utils/regionsParser");
const token = require("../../../../../api-elecciones/utils/getToken");
const ApiFetcher = require("../../../../../api-elecciones/utils/axios").ApiFetcher;

export default async function handler(req, res) {
  const { categoryId, provinceId } = req.query;

  // Chequear si esta en base de datos. Si no esta, pedirlo
  const tokenResponse = await token.getToken();
  const fetcher = new ApiFetcher(tokenResponse);
  const regionsByCategory = await regions.getRegionsByCategeory(fetcher);
  // Guardar en base de datos

  const regionByCategory = regionsByCategory.find(
    (category) => category.code === categoryId
  );

  try {
    const resultsByRegion = await Promise.all(
      regionByCategory.country.districts.find(district => district.code === provinceId).sections.map((region) => {
        return fetcher
          .get(
            `resultados/getResultados?categoriaId=${categoryId}&distritoId=${provinceId}&seccionId=${region.code}`
          )
          .then((response) => {
            return {
              code: provinceId + region.code,
              state: response.data,
            };
          });
      })
    );

    const provinceResults = await
      fetcher
        .get(
          `resultados/getResultados?categoriaId=${categoryId}&distritoId=${provinceId}`
        )
        .then((response) => {
          return {
            code: provinceId,
            state: response.data,
          };
        })



    res.status(200).json({
      error: false,
      message: "Data successfully fetched!",
      response: [provinceResults, ...resultsByRegion]
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: error.message,
      response: null,
    });
  }
}
