const fileReader = require("./fileReader");
const fileWriter = require("./fileWriter");

class Candidate {
  category;
  agrupation;
  list;
  totalVotes;
  tableVotes;

  constructor(candidate) {
    this.category = {
      code: candidate[0],
      name: candidate[1],
    };
    this.agrupation = {
      code: candidate[2],
      name: candidate[3],
    };
    this.list = {
      code: candidate[4],
      name: candidate[5],
    };

    this.totalVotes = 0;

    this.tableVotes = [];
  }

  addTableVotes = (votes) => {
    this.tableVotes.push(votes);
    this.totalVotes += votes.votes;
  };
}

class TableVotes {
  region;
  tableCode;
  categoryCode;
  agrupationCode;
  listCode;
  votes;

  constructor(tableVotes) {
    this.region = {
      district: tableVotes[0],
      section: tableVotes[1],
      circuit: tableVotes[2],
    };

    this.tableCode = tableVotes[3];
    this.categoryCode = tableVotes[4];
    this.agrupationCode = tableVotes[5];
    this.listCode = tableVotes[6];
    this.votes = parseInt(tableVotes[7]);
  }
}

const candidates = new Map();
const categories = new Map();

const storeLine = (line) => {
  const candidate = new Candidate(line);
  if (candidate.list.code) {
    candidates.set(candidate.list.code, candidate);
    if (!categories.has(candidate.category.code))
      categories.set(candidate.category.code, []);
    categories.get(candidate.category.code)?.push(candidate);
  }
};

const resolveMap = async (resolve) => {
  const afterVotes = () => {
    const finalJson = {
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
        const {
          list,
          agrupation,
          totalVotes,
          tableVotes,
          category,
        } = candidate;
        return { agrupation, list, totalVotes };
      });
      const finalData = {
        code: data[0],
        name: data[1][0].category.name,
        candidates: resumedCandidates.sort(
          (a, b) => b.totalVotes - a.totalVotes
        ),
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

    resolve(finalJson);
  };

  fileReader.readFile(
    "mesas_totales_lista.dsv",
    (line) => {
      const tableVote = new TableVotes(line);
      if (tableVote.tableCode)
        candidates.get(tableVote.listCode)?.addTableVotes(tableVote);
    },
    afterVotes
  );
};

const getCategories = () => {
  return new Promise((resolve, reject) => {
    fileReader.readFile("descripcion_postulaciones.dsv", storeLine, () =>
      resolveMap(resolve)
    );
  });
};

const createCategoriesFile = async () => {
  const categoriesJSON = await getCategories();
  fileWriter.writeFile("categories", categoriesJSON);

  return categoriesJSON;
};

exports.createCategoriesFile = createCategoriesFile;
