// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ApiResponse from "../../../model/ApiResponse";
const regions = require("../../../api-elecciones/utils/regionsParser");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // const fileData = fs.readFileSync("public/data/categories.json", "utf-8");

  // const categories = JSON.parse(fileData);

  // const categoriesName = Object.getOwnPropertyNames(categories);

  const regionsByCategory = await regions.getRegionsByCategeory();

  res.status(200).json({
    error: false,
    message: "Data successfully fetched!",
    response: {
      categories: regionsByCategory,
    },
  });
}
