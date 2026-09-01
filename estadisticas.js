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

    return await respuesta.json();
}
async function obtenerPersonajes1() {

    const inicio = performance.now();

    const primeraPagina = await obtenerPagina(API_URL);

    const totalPaginas = primeraPagina.info.pages;

    let personajes = [...primeraPagina.results];

    for (let pagina = 2; pagina <= totalPaginas; pagina++) {

        const datos = await obtenerPagina(
            `${API_URL}?page=${pagina}`
        );

        personajes.push(...datos.results);
    }

    const fin = performance.now();


    console.log("");
    console.log("--- Estrategia 1: Secuencial ---");
    console.log("");
    console.log("Total de páginas: " + totalPaginas);
    console.log("Total de personajes: " + personajes.length);
    console.log("Tiempo: " + (fin - inicio).toFixed(2) + " ms");

    return personajes;
}


async function obtenerPersonajes2() {

    const inicio = performance.now();

    const primeraPagina = await obtenerPagina(API_URL);

    const totalPaginas = primeraPagina.info.pages;

    let personajes = [...primeraPagina.results];

    const peticiones = [];

    for (let pagina = 2; pagina <= totalPaginas; pagina++) {

        peticiones.push(
            obtenerPagina(`${API_URL}?page=${pagina}`)
        );
    }

    const paginas = await Promise.all(peticiones);

    for (const pagina of paginas) {
        personajes.push(...pagina.results);
    }

    const fin = performance.now();


    console.log("");
    console.log("--- Estrategia 2: Concurrente ---");
    console.log("");
    console.log("Total de páginas: " + totalPaginas);
    console.log("Total de personajes: " + personajes.length);
    console.log("Tiempo: " + (fin - inicio).toFixed(2) + " ms");

    return personajes;
}

async function main() {

    await obtenerPersonajes1();

    await obtenerPersonajes2();

}

main();
