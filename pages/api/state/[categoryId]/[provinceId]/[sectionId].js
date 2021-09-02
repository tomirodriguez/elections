// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const regions = require("../../../../../api-elecciones/utils/regionsParser");
const token = require("../../../../../api-elecciones/utils/getToken");
const ApiFetcher = require("../../../../../api-elecciones/utils/axios")
  .ApiFetcher;

export default async function handler(req, res) {
  const { categoryId, provinceId, sectionId } = req.query;

  const tokenResponse = await token.getToken();
  const fetcher = new ApiFetcher(tokenResponse);

  try {
    const resultsByRegion = await fetcher
      .get(
        `resultados/getResultados?categoriaId=${categoryId}&distritoId=${provinceId}&seccionId=${sectionId}`
      )
      .then((response) => {
        if (response.data)
          return {
            province: provinceId,
            section: sectionId,
            state: response.data,
          };
        throw new Error("No found");
      });

    res.status(200).json({
      error: false,
      message: "Data successfully fetched!",
      response: resultsByRegion,
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: "Province not found!",
      response: null,
    });
  }
}
