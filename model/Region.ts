export class Region {
  code: string;
  name: string;

  constructor(data: string[]) {
    this.code = data[0];
    this.name = data[1];
  }
}
