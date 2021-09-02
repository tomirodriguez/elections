// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ApiResponse from "../../../model/ApiResponse";
const candidates = require("../../../api-elecciones/utils/candidatesParser");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const candidatesByCategory = await candidates.getCandidatesByCategeory();

  console.log(candidatesByCategory);
  

  res.status(200).json({
    error: false,
    message: "Data successfully fetched!",
    response: {
      candidates: candidatesByCategory,
    },
  });
}
