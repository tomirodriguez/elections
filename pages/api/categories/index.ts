// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ApiResponse from "../../../model/ApiResponse";
const candidates = require("../../../api-elecciones/utils/candidatesParser");

// const jsonFiles = path.join(process.cwd(), "public/data");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // const fileData = fs.readFileSync("public/data/categories.json", "utf-8");

  // const categories = JSON.parse(fileData);

  // const categoriesName = Object.getOwnPropertyNames(categories);

  const candidatesByCategory = await candidates.getCandidatesByRegion();

  res.status(200).json({
    error: false,
    message: "Data successfully fetched!",
    response: {
      candidates: candidatesByCategory,
    },
  });
}
