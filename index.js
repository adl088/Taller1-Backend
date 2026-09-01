const API = "https://rickandmortyapi.com/api/character";
const { compararEstrategias } = require('./estadisticas');
const { ejecutarConsultas, imprimirConsultas } = require('./consultas');

// Parte A: normalización
function normalizarPersonajes(personajes) {
  return personajes.map((personaje) => ({
    id: personaje.id,
    nombre: personaje.name,
    estado: personaje.status,
    especie: personaje.species,
    tipo: personaje.type,
    genero: personaje.gender,
    origen: personaje.origin.name,
    ubicacionActual: personaje.location.name,
    cantidadEpisodios: personaje.episode.length,
    imagen: personaje.image
  }));
}

async function main() {
  try {
    const personajes = await compararEstrategias();

    // Parte A
    const normalizados = normalizarPersonajes(personajes);
    console.log("\n--- Parte A: Normalización ---");
    console.log("Total de personajes normalizados:", normalizados.length);
    console.log("Ejemplo:", normalizados[0]);

    // Parte B
    const resultadosConsultas = ejecutarConsultas(normalizados);
    imprimirConsultas(resultadosConsultas);

  } catch (error) {
    console.error(error.message);
  }
}

main();