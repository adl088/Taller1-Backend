const API_URL = "https://rickandmortyapi.com/api/character";

/**
 * Convierte un personaje de la API al formato solicitado en la parte A.
 */
function normalizarPersonaje(personaje) {
  return {
    id: personaje.id,
    nombre: personaje.name,
    estado: personaje.status,
    especie: personaje.species,
    tipo: personaje.type,
    genero: personaje.gender,
    origen: personaje.origin.name,
    ubicacionActual: personaje.location.name,
    cantidadEpisodios: personaje.episode.length,
    imagen: personaje.image,
  };
}

async function consultarPagina(url, intento = 1) {
  const respuesta = await fetch(url);

  if (respuesta.status === 429 && intento <= 3) {
    const espera = Number(respuesta.headers.get("retry-after") ?? intento);
    await new Promise((resolver) => setTimeout(resolver, espera * 1000));
    return consultarPagina(url, intento + 1);
  }

  if (!respuesta.ok) {
    throw new Error(
      `No se pudo consultar ${url}: ${respuesta.status} ${respuesta.statusText}`,
    );
  }

  return respuesta.json();
}

/**
 * Consulta la primera pagina para descubrir cuantas existen y luego obtiene
 * automaticamente todas las restantes. Devuelve un unico arreglo normalizado.
 */
async function obtenerPersonajesNormalizados() {
  const primeraPagina = await consultarPagina(API_URL);
  const urlsRestantes = [];
  const paginasRestantes = [];
  const TAMANO_GRUPO = 10;

  for (let numeroPagina = 2; numeroPagina <= primeraPagina.info.pages; numeroPagina++) {
    urlsRestantes.push(`${API_URL}?page=${numeroPagina}`);
  }

  // Promise.all mantiene las peticiones de cada grupo en ejecucion concurrente.
  for (let inicio = 0; inicio < urlsRestantes.length; inicio += TAMANO_GRUPO) {
    const grupo = urlsRestantes.slice(inicio, inicio + TAMANO_GRUPO);
    const paginasDelGrupo = await Promise.all(
      grupo.map((url) => consultarPagina(url)),
    );
    paginasRestantes.push(...paginasDelGrupo);
  }

  const todosLosPersonajes = paginasRestantes.reduce(
    (personajes, pagina) => personajes.concat(pagina.results),
    primeraPagina.results,
  );

  return todosLosPersonajes.map(normalizarPersonaje);
}

async function main() {
  try {
    const personajes = await obtenerPersonajesNormalizados();
    console.log(`Total de personajes normalizados: ${personajes.length}`);
    console.log("Primer personaje:");
    console.log(personajes[0]);
  } catch (error) {
    console.error("Error al obtener los personajes:", error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  normalizarPersonaje,
  obtenerPersonajesNormalizados,
};
