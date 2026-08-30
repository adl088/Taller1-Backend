const humanosVivos = personajesNormalizados.filter(
    personaje =>
        personaje.estado === "Alive" &&
        personaje.especie === "Human"
);
console.log("Cantidad de humanos vivos:", humanosVivos.length);
console.log("Humanos vivos:", humanosVivos);

const personajes20Episodios = personajesNormalizados.filter(
        personaje => personaje.cantidadEpisodios >= 20
    );

console.log("Cantidad de personajes con 20 o más episodios:",personajes20Episodios.length);
console.log("Personajes con 20 o más episodios:",personajes20Episodios);


const personajeAlienFemale =
    personajesNormalizados.find(
        personaje =>
            personaje.especie === "Alien" &&
            personaje.genero === "Female"
    );
console.log("Primer Alien Female:", personajeAlienFemale);

const existeTipo = personajesNormalizados.some(
    personaje => personaje.tipo !== ""
);
console.log("¿Existe algún personaje con tipo?:", existeTipo);

const todosValidos = personajesNormalizados.every(
    personaje =>
        personaje.imagen &&
        personaje.cantidadEpisodios >= 1
);
console.log("¿Todos tienen imagen y al menos un episodio?:",todosValidos);


const estadisticasPorEspecie = personajesNormalizados.reduce((acumulador, personaje) => {
    const especie = personaje.especie;

    if (!acumulador[especie]) {
        acumulador[especie] = {
            cantidad: 0,
            totalEpisodios: 0,
            vivos: 0
        };
    }

    // Aumentar cantidad de personajes
    acumulador[especie].cantidad++;

    // Acumular cantidad de episodios
    acumulador[especie].totalEpisodios += personaje.cantidadEpisodios;

    // Contar personajes vivos
    if (personaje.estado === "Alive") {
        acumulador[especie].vivos++;
    }

    return acumulador;

}, {});


// Calcular el promedio de episodios
Object.keys(estadisticasPorEspecie).forEach(especie => {

    const datos = estadisticasPorEspecie[especie];

    datos.promedioEpisodios =
        datos.totalEpisodios / datos.cantidad;

    // Ya no necesitamos mostrar el total
    delete datos.totalEpisodios;
});

console.log("Estadísticas por especie:",
    estadisticasPorEspecie
);


function clasificarPorEpisodios(personajes) {
  return personajes.reduce((acumulador, personaje) => {
    const episodios = personaje.cantidadEpisodios;

    if (episodios >= 1 && episodios <= 5) {
      acumulador["1-5"]++;
    } else if (episodios >= 6 && episodios <= 15) {
      acumulador["6-15"]++;
    } else if (episodios >= 16 && episodios <= 30) {
      acumulador["16-30"]++;
    } else if (episodios > 30) {
      acumulador["Más de 30"]++;
    }

    return acumulador;
  }, {
    "1-5": 0,
    "6-15": 0,
    "16-30": 0,
    "Más de 30": 0
  });
}

const clasificacionEpisodios = clasificarPorEpisodios(personajesNormalizados);
console.log("Clasificación por cantidad de episodios:",clasificacionEpisodios);
