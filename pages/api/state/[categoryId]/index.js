// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const regions = require("../../../../api-elecciones/utils/regionsParser");
const token = require("../../../../api-elecciones/utils/getToken");
const ApiFetcher = require("../../../../api-elecciones/utils/axios").ApiFetcher;

export default async function handler(req, res) {
  const { categoryId } = req.query;

  // Chequear si esta en base de datos. Si no esta, pedirlo
  const tokenResponse = await token.getToken();
  const fetcher = new ApiFetcher(tokenResponse);
  const regionsByCategory = await regions.getRegionsByCategeory(fetcher);
  // Guardar en base de datos

  const regionByCategory = regionsByCategory.find(
    (category) => category.code === categoryId
  );

  try {
    const resultsByRegion = await Promise.all(
      regionByCategory.country.districts.map((region) => {
        return fetcher
          .get(
            `resultados/getResultados?categoriaId=${categoryId}&distritoId=${region.code}`
          )
          .then((response) => {
            return {
              code: region.code,
              state: response.data,
            };
          });
      })
    );

    let total = {
      estadoRecuento: {
        mesasEsperadas: 0,
        mesasTotalizadas: 0,
        cantidadElectores: 0,
        cantidadVotantes: 0,
      },
      valoresTotalizadosOtros: {
        votosNulos: 0,
        votosEnBlanco: 0,
        votosRecurridosComandoImpugnados: 0,
        votosEnBlancoPorcentaje: 0,
        votosRecurridosComandoImpugnadosPorcentaje: 0,
        votosNulosPorcentaje: 0,
      },
      valoresTotalizadosPositivos: []
    }

    let totalVotes = 0

    console.log(resultsByRegion)

    resultsByRegion.forEach(region => {
      const regionData = region.state
      Object.getOwnPropertyNames(total.estadoRecuento).forEach(prop => {
        total.estadoRecuento[prop] += regionData.estadoRecuento[prop]
      })
      Object.getOwnPropertyNames(total.valoresTotalizadosOtros).forEach(prop => {
        total.valoresTotalizadosOtros[prop] += regionData.valoresTotalizadosOtros[prop]
      })

      console.log(regionData.valoresTotalizadosPositivos)

      regionData.valoresTotalizadosPositivos.forEach(agrupation => {
        const agrupationFound = total.valoresTotalizadosPositivos.find(agrupationInArray => agrupationInArray.idAgrupacion === agrupation.idAgrupacion)
        if (!agrupationFound) {
          total.valoresTotalizadosPositivos.push({ ...agrupation })
        } else {
          agrupationFound.votos += agrupation.votos;
          agrupation.listas.forEach(list => {
            const stored = agrupationFound.listas.find(listStored => listStored.idLista === list.idLista);
            if (!stored) {
              agrupation.listas.push(list)
            } else {
              stored.votos += list.votos
            }
          })
        }
        totalVotes += agrupation.votos
      })

      total.valoresTotalizadosPositivos.forEach(agrupation => {
        agrupation.votosPorcentaje = agrupation.votos * 100 / totalVotes;
        agrupation.listas.forEach(list => {
          list.votosPorcentaje = list.votos * 100 / agrupation.votos
        })
      })

    });

    total.estadoRecuento.mesasTotalizadasPorcentaje = total.estadoRecuento.mesasTotalizadas * 100 / total.estadoRecuento.mesasEsperadas || 0;
    total.estadoRecuento.participacionPorcentaje = total.estadoRecuento.cantidadVotantes * 100 / total.estadoRecuento.cantidadElectores || 0;

    total.valoresTotalizadosOtros.votosEnBlancoPorcentaje = total.valoresTotalizadosOtros.votosEnBlanco * 100 / total.estadoRecuento.cantidadVotantes || 0;
    total.valoresTotalizadosOtros.votosRecurridosComandoImpugnadosPorcentaje = total.valoresTotalizadosOtros.votosRecurridosComandoImpugnados * 100 / total.estadoRecuento.cantidadVotantes || 0;
    total.valoresTotalizadosOtros.votosNulosPorcentaje = total.valoresTotalizadosOtros.votosNulos * 100 / total.estadoRecuento.cantidadVotantes || 0;


    total.estadoRecuento.votosTotales = totalVotes;

    resultsByRegion.unshift({ code: '99', state: total })



    res.status(200).json({
      error: false,
      message: "Data successfully fetched!",
      response: resultsByRegion
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: error.message,
      response: null,
    });
  }
}
