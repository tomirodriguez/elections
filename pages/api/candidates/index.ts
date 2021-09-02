// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ApiResponse from "../../../model/ApiResponse";
const candidates = require("../../../api-elecciones/utils/candidatesParser");
const token = require("../../../api-elecciones/utils/getToken");
const ApiFetcher = require("../../../api-elecciones/utils/axios").ApiFetcher;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const tokenResponse = await token.getToken();
  const fetcher = new ApiFetcher(tokenResponse);
  const candidatesByCategory = await candidates.getCandidatesByCategeory(
    fetcher
  );

  res.status(200).json({
    error: false,
    message: "Data successfully fetched!",
    response: {
      candidates: candidatesByCategory,
    },
  });
}
