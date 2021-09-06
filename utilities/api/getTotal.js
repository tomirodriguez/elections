const getTotal = (regionsToCalculate) => {
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

  regionsToCalculate.forEach(region => {
    const regionData = region.state
    Object.getOwnPropertyNames(total.estadoRecuento).forEach(prop => {
      total.estadoRecuento[prop] += regionData.estadoRecuento[prop]
    })
    Object.getOwnPropertyNames(total.valoresTotalizadosOtros).forEach(prop => {
      total.valoresTotalizadosOtros[prop] += regionData.valoresTotalizadosOtros[prop]
    })

    regionData.valoresTotalizadosPositivos.forEach(agrupation => {
      const agrupationFound = total.valoresTotalizadosPositivos.find(agrupationInArray => agrupationInArray.idAgrupacion === agrupation.idAgrupacion)
      if (!agrupationFound) {
        total.valoresTotalizadosPositivos.push(agrupation)
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

  return total;
};

exports.getTotal = getTotal;
