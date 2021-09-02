// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const regions = require("../../../../api-elecciones/utils/regionsParser");
const token = require("../../../../api-elecciones/utils/getToken");
const ApiFetcher = require("../../../../api-elecciones/utils/axios").ApiFetcher;

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

  const province = regionByCategory.country.districts.find(
    (district) => district.code === provinceId
  );

  if (province) {
    res.status(200).json({
      error: false,
      message: "Data successfully fetched!",
      response: province,
    });
  } else {
    res.status(404).json({
      error: true,
      message: "Province not found for current category.",
      response: null,
    });

  }
}
