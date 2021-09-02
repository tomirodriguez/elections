// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ApiResponse from "../../../model/ApiResponse";
const regions = require("../../../api-elecciones/utils/regionsParser");
const token = require("../../../api-elecciones/utils/getToken");
const ApiFetcher = require("../../../api-elecciones/utils/axios").ApiFetcher;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Chequear si esta en base de datos. Si no esta, pedirlo
  const tokenResponse = await token.getToken();
  const fetcher = new ApiFetcher(tokenResponse);
  const regionsByCategory = await regions.getRegionsByCategeory(fetcher);
  // Guardar en base de datos

  res.status(200).json({
    error: false,
    message: "Data successfully fetched!",
    response: {
      categories: regionsByCategory,
    },
  });
}
