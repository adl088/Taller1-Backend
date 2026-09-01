function ejecutarConsultas(personajesNormalizados) {
  // 1. filter: vivos y de especie Human
  const humanosVivos = personajesNormalizados.filter(
    personaje => personaje.estado === "Alive" && personaje.especie === "Human"
  );

  // 2. filter: 20 o más episodios
  const personajes20Episodios = personajesNormalizados.filter(
    personaje => personaje.cantidadEpisodios >= 20
  );

  // 3. find: primer Alien Female
  const personajeAlienFemale = personajesNormalizados.find(
    personaje => personaje.especie === "Alien" && personaje.genero === "Female"
  );

  // 4. some: existe algún personaje con "type" informado
  const existeTipo = personajesNormalizados.some(
    personaje => personaje.tipo !== ""
  );

  // 5. every: todos tienen imagen y al menos un episodio
  const todosValidos = personajesNormalizados.every(
    personaje => personaje.imagen && personaje.cantidadEpisodios >= 1
  );

  // 6. reduce: agrupar por especie (cantidad, promedio de episodios, vivos)
  const estadisticasPorEspecie = personajesNormalizados.reduce((acumulador, personaje) => {
    const especie = personaje.especie;

    if (!acumulador[especie]) {
      acumulador[especie] = { cantidad: 0, totalEpisodios: 0, vivos: 0 };
    }

    acumulador[especie].cantidad++;
    acumulador[especie].totalEpisodios += personaje.cantidadEpisodios;

    if (personaje.estado === "Alive") {
      acumulador[especie].vivos++;
    }

    return acumulador;
  }, {});

  Object.keys(estadisticasPorEspecie).forEach(especie => {
    const datos = estadisticasPorEspecie[especie];
    datos.promedioEpisodios = datos.totalEpisodios / datos.cantidad;
    delete datos.totalEpisodios;
  });

  // 7. reduce: clasificar por rango de episodios
  const clasificacionEpisodios = personajesNormalizados.reduce((acumulador, personaje) => {
    const episodios = personaje.cantidadEpisodios;

    if (episodios >= 1 && episodios <= 5) acumulador["1-5"]++;
    else if (episodios >= 6 && episodios <= 15) acumulador["6-15"]++;
    else if (episodios >= 16 && episodios <= 30) acumulador["16-30"]++;
    else if (episodios > 30) acumulador["30+"]++;

    return acumulador;
  }, { "1-5": 0, "6-15": 0, "16-30": 0, "30+": 0 });

  return {
    humanosVivos,
    personajes20Episodios,
    personajeAlienFemale,
    existeTipo,
    todosValidos,
    estadisticasPorEspecie,
    clasificacionEpisodios
  };
}

function imprimirConsultas(resultados) {
  console.log("\n--- Parte B: Consultas ---");
  console.log("Cantidad de humanos vivos:", resultados.humanosVivos.length);
  console.log("Cantidad con 20+ episodios:", resultados.personajes20Episodios.length);
  console.log("Primer Alien Female:", resultados.personajeAlienFemale);
  console.log("¿Existe algún personaje con tipo informado?:", resultados.existeTipo);
  console.log("¿Todos tienen imagen y al menos un episodio?:", resultados.todosValidos);
  console.log("Estadísticas por especie:", resultados.estadisticasPorEspecie);
  console.log("Clasificación por episodios:", resultados.clasificacionEpisodios);
}

module.exports = { ejecutarConsultas, imprimirConsultas };