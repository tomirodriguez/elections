import { TableVotes } from "./TableVotes";

export class Candidate {
  category: { code: string; name: string };
  agrupation: { code: string; name: string };
  list: { code: string; name: string };
  totalVotes: number;
  tableVotes: TableVotes[];

  constructor(candidate: string[]) {
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

  addTableVotes = (votes: TableVotes) => {
    this.tableVotes.push(votes);
    this.totalVotes += votes.votes;
  };
}
