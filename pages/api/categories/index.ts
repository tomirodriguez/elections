// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import ApiResponse from "../../../model/ApiResponse";

// const jsonFiles = path.join(process.cwd(), "public/data");

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const fileData = fs.readFileSync("public/data/categories.json", "utf-8");

  const categories = JSON.parse(fileData);

  const categoriesName = Object.getOwnPropertyNames(categories);

  res.status(200).json({
    error: false,
    message: "Data successfully fetched!",
    response: {
      categories: categoriesName.map((catName) => {
        return { code: catName, name: categories[catName].name };
      }),
    },
  });
}
