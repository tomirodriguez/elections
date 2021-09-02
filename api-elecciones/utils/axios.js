const axios = require("axios").default;

class ApiFetcher {
  constructor(token) {
    this.token = token;
    axios.defaults.baseURL = "https://api.resultados.gob.ar/api/";
    axios.defaults.headers.common = { Authorization: `bearer ${token}` };
  }

  get(path) {
    return axios.get(path);
  }
}

exports.ApiFetcher = ApiFetcher;
