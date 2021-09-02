// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ApiResponse from "../../../model/ApiResponse";
const regions = require("../../../api-elecciones/utils/regionsParser");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const regionsByCategory = await regions.getRegionsByCategeory();

  res.status(200).json({
    error: false,
    message: "Data successfully fetched!",
    response: {
      categories: regionsByCategory,
    },
  });
}
