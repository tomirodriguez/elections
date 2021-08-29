// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import ApiResponse from "../../../model/ApiResponse";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const fileData = fs.readFileSync("/public/data/regions.json", "utf-8");

  const regions = JSON.parse(fileData);
  res.status(200).json({
    error: false,
    message: "Data successfully fetched!",
    response: { regions: regions },
  });
}
