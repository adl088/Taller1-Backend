const API = "https://rickandmortyapi.com/api/character";

async function consultarPagina(url) {
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`Error al consultar la API: ${respuesta.status}`);
  }

  return respuesta.json();
}

async function obtenerPersonajes() {
  const primeraPagina = await consultarPagina(API);
  const paginasRestantes = Array.from(
    { length: primeraPagina.info.pages - 1 },
    (_, indice) => `${API}?page=${indice + 2}`
  );
  const respuestas = await Promise.all(
    paginasRestantes.map((url) => consultarPagina(url))
  );

  return [primeraPagina, ...respuestas].flatMap((pagina) => pagina.results);
}

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
    const personajes = await obtenerPersonajes();
    const normalizados = normalizarPersonajes(personajes);

    console.log(normalizados);
    console.log(`Total de personajes: ${normalizados.length}`);
  } catch (error) {
    console.error(error.message);
  }
}

main();
