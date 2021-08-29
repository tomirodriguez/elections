// CODIGO_DISTRITO|CODIGO_SECCION|CODIGO_CIRCUITO|CODIGO_MESA|CODIGO_CATEGORIA|CODIGO_AGRUPACION|CODIGO_LISTA|VOTOS_LISTA

export class TableVotes {
  region: { district: string; section: string; circuit: string };
  tableCode: string;
  categoryCode: string;
  agrupationCode: string;
  listCode: string;
  votes: number;

  constructor(tableVotes: string[]) {
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
