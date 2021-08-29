// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { Candidate } from "../../../model/Candidate";
import { Region } from "../../../model/Region";
import { TableVotes } from "../../../model/TableVotes";

const dataDirectory = path.join(process.cwd(), "data-source");
const jsonFiles = path.join(process.cwd(), "data");

type Data = {
  res: string;
};

const readFile = (fileName: string) => {
  const fileData = fs.readFileSync(
    path.join(dataDirectory, `${fileName}.dsv`),
    "utf-8"
  );
  const arrayOfData = fileData.split("\n");

  // REMOVE HEADERS
  arrayOfData.shift();

  const arrayOfDataSplitted = arrayOfData.map((elem) => elem.split("|"));

  return arrayOfDataSplitted;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const candidates = new Map<string, Candidate>();
  const categories = new Map<string, Candidate[]>();

  const candidatesData = readFile("descripcion_postulaciones");
  candidatesData.forEach((data) => {
    const candidate = new Candidate(data);
    if (candidate.list.code) {
      candidates.set(candidate.list.code, candidate);
      if (!categories.has(candidate.category.code))
        categories.set(candidate.category.code, []);
      categories.get(candidate.category.code)?.push(candidate);
    }
  });

  const regionsData = readFile("descripcion_regiones");
  const regions = regionsData.map((data) => new Region(data));

  const tableVotes = readFile("mesas_totales_lista");
  tableVotes.forEach((data) => {
    const tableVote = new TableVotes(data);
    if (tableVote.tableCode)
      candidates.get(tableVote.listCode)?.addTableVotes(tableVote);
  });

  const finalJson: any = {
    president: { name: "Presidente", categories: [] },
    senator: { name: "Senadores", categories: [] },
    deputy: { name: "Diputados", categories: [] },
    mayor: { name: "Intendentes", categories: [] },
    governor: { name: "Gobernadores", categories: [] },
    governmentsHead: { name: "Jefe de Gobierno", categories: [] },
    communityBoard: { name: "Junta Comunal", categories: [] },
    others: { name: "Otros", categories: [] },
  };

  Array.from(categories).forEach((data) => {
    const resumedCandidates = data[1].map((candidate) => {
      const { list, agrupation, totalVotes, tableVotes, category } = candidate;
      return { agrupation, list, totalVotes };
    });
    const finalData = {
      code: data[0],
      name: data[1][0].category.name,
      candidates: resumedCandidates.sort((a, b) => b.totalVotes - a.totalVotes),
    };

    if (finalData.name.toLocaleLowerCase().includes("presidente"))
      finalJson.president.categories.push(finalData);
    else if (finalData.name.toLocaleLowerCase().includes("senador"))
      finalJson.senator.categories.push(finalData);
    else if (finalData.name.toLocaleLowerCase().includes("diputado"))
      finalJson.deputy.categories.push(finalData);
    else if (finalData.name.toLocaleLowerCase().includes("intendente"))
      finalJson.mayor.categories.push(finalData);
    else if (finalData.name.toLocaleLowerCase().includes("gobernador"))
      finalJson.governor.categories.push(finalData);
    else if (finalData.name.toLocaleLowerCase().includes("jefe de gobierno"))
      finalJson.governmentsHead.categories.push(finalData);
    else if (finalData.name.toLocaleLowerCase().includes("junta comunal"))
      finalJson.communityBoard.categories.push(finalData);
    else finalJson.others.categories.push(finalData);
  });

  // const categorySet = new Set<string>();
  // const tableMissedVotes = fs.readFileSync(
  //   path.join(dataDirectory, `mesas_totales.dsv`),
  //   "utf-8"
  // );

  // console.log(tableMissedVotes.split("\n"));

  // tableMissedVotes.forEach((data) => {
  //   categorySet.add(data[4]);
  //   // CODIGO_DISTRITO|CODIGO_SECCION|CODIGO_CIRCUITO|CODIGO_MESA|CODIGO_CATEGORIA|CONTADOR|VALOR
  // });

  // console.log(categorySet);

  fs.writeFileSync(jsonFiles + "/categories.json", JSON.stringify(finalJson));

  res.status(200).json({
    res: "JSON Database Created",
  });
}
