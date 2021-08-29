// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const jsonFiles = path.join(process.cwd(), "data");

type Data = {
  error: boolean;
  response: object;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const fileData = fs.readFileSync(
    path.join(jsonFiles, "categories.json"),
    "utf-8"
  );

  const categories = JSON.parse(fileData);

  const categoriesName = Object.getOwnPropertyNames(categories);

  res.status(200).json({
    error: false,
    response: {
      categories: categoriesName.map((catName) => {
        return { code: catName, name: categories[catName].name };
      }),
    },
  });
}
