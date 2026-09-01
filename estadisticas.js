const API_URL = "https://rickandmortyapi.com/api/character";

async function obtenerPagina(url) {
  const respuesta = await fetch(url);

  if (respuesta.status === 429) {
    console.log("Límite de solicitudes alcanzado. Esperando...");
    await new Promise(resolve => setTimeout(resolve, 3000));
    return obtenerPagina(url);
  }

  if (!respuesta.ok) {
    throw new Error("Error HTTP: " + respuesta.status);
  }

  return respuesta.json();
}

// Estrategia 1: consultas secuenciales (await dentro de un ciclo)
async function obtenerPersonajesSecuencial() {
  const inicio = performance.now();

  const primeraPagina = await obtenerPagina(API_URL);
  const totalPaginas = primeraPagina.info.pages;

  let personajes = [...primeraPagina.results];

  for (let pagina = 2; pagina <= totalPaginas; pagina++) {
    const datos = await obtenerPagina(`${API_URL}?page=${pagina}`);
    personajes.push(...datos.results);
  }

  const fin = performance.now();
  const tiempoMs = fin - inicio;

  console.log("\n--- Estrategia 1: Secuencial ---");
  console.log("Total de páginas:", totalPaginas);
  console.log("Total de personajes:", personajes.length);
  console.log("Tiempo:", tiempoMs.toFixed(2), "ms");

  return { personajes, tiempoMs };
}

// Estrategia 2: consultas concurrentes con Promise.all()
async function obtenerPersonajesConcurrente() {
  const inicio = performance.now();

  const primeraPagina = await obtenerPagina(API_URL);
  const totalPaginas = primeraPagina.info.pages;

  const peticiones = [];
  for (let pagina = 2; pagina <= totalPaginas; pagina++) {
    peticiones.push(obtenerPagina(`${API_URL}?page=${pagina}`));
  }

  const paginasRestantes = await Promise.all(peticiones);

  let personajes = [...primeraPagina.results];
  for (const pagina of paginasRestantes) {
    personajes.push(...pagina.results);
  }

  const fin = performance.now();
  const tiempoMs = fin - inicio;

  console.log("\n--- Estrategia 2: Concurrente ---");
  console.log("Total de páginas:", totalPaginas);
  console.log("Total de personajes:", personajes.length);
  console.log("Tiempo:", tiempoMs.toFixed(2), "ms");

  return { personajes, tiempoMs };
}

async function compararEstrategias() {
  const { tiempoMs: tiempoSecuencial } = await obtenerPersonajesSecuencial();
  const { personajes, tiempoMs: tiempoConcurrente } = await obtenerPersonajesConcurrente();

  console.log("\n--- Comparación de estrategias ---");
  console.log("Secuencial:", tiempoSecuencial.toFixed(2), "ms");
  console.log("Concurrente:", tiempoConcurrente.toFixed(2), "ms");

  return personajes;
}

module.exports = {
  obtenerPersonajesSecuencial,
  obtenerPersonajesConcurrente,
  compararEstrategias
};

if (require.main === module) {
  compararEstrategias().catch(error => console.error(error.message));
}