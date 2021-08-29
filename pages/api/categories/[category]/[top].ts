// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import ApiResponse from "../../../../model/ApiResponse";
import { getTopCandidates } from "../../../../utilities/utils";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  console.log(req.query);

  const { category: categoryParam, top } = req.query;
  const topValue = Array.isArray(top) ? top[0] : top;
  const size = parseInt(topValue);

  const category = Array.isArray(categoryParam)
    ? categoryParam[0]
    : categoryParam;

  const fileData = fs.readFileSync("data/categories.json", "utf-8");

  const categories = JSON.parse(fileData);
  const data: { name: string; categories: any[] } = categories[category];

  if (data) {
    console.log(data);

    res.status(200).json({
      error: false,
      message: "Data successfully fetched!",
      response: {
        name: data.name,
        categories: getTopCandidates(data.categories, size),
      },
    });
  } else {
    res.status(404).json({
      error: true,
      message: "There is no category with that name.",
      response: {},
    });
  }
}
