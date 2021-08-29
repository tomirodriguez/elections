// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import ApiResponse from "../../../../model/ApiResponse";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { category: categoryParam } = req.query;
  const category = Array.isArray(categoryParam)
    ? categoryParam[0]
    : categoryParam;

  const fileData = fs.readFileSync("pub;ic/data/categories.json", "utf-8");

  const categories = JSON.parse(fileData);
  const data = categories[category];

  if (data) {
    res.status(200).json({
      error: false,
      message: "Data successfully fetched!",
      response: data,
    });
  } else {
    res.status(404).json({
      error: true,
      message: "There is no category with that name.",
      response: {},
    });
  }
}
