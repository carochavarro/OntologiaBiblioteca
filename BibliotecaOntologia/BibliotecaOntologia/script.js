document.addEventListener('DOMContentLoaded', () => {
    const searchTypeElement = document.getElementById('searchType');
    const searchInputElement = document.getElementById('searchInput');
    const resultsElement = document.getElementById('results');
    const loadingIcon = document.getElementById('loadingIcon');
    const modeToggle = document.getElementById('modeToggle');
    const body = document.body;
    const header = document.querySelector('header');
    const results = document.querySelector('.results');
    const toggleLabel = document.querySelector('.toggle-label');
    const searchBar = document.querySelector('.search-bar');
    const searchElements = document.querySelectorAll('.search-bar select, .search-bar input[type="text"]');

    const updateMode = () => {
        const isDarkMode = modeToggle.checked;
        if (isDarkMode) {
            body.classList.add('dark-mode');
            header.classList.add('dark-mode');
            results.classList.add('dark-mode');
            toggleLabel.classList.add('dark-mode');
            searchBar.classList.add('dark-mode');
            searchElements.forEach(item => item.classList.add('dark-mode'));
        } else {
            body.classList.remove('dark-mode');
            header.classList.remove('dark-mode');
            results.classList.remove('dark-mode');
            toggleLabel.classList.remove('dark-mode');
            searchBar.classList.remove('dark-mode');
            searchElements.forEach(item => item.classList.remove('dark-mode'));
        }
        updateResultsMode(); // Actualizar el modo de los resultados
    };

    const updateResultsMode = () => {
        const resultsItems = document.querySelectorAll('.result');
        const noResultsItems = document.querySelectorAll('.no-results p');
        const isDarkMode = modeToggle.checked;
        resultsItems.forEach(item => {
            if (isDarkMode) {
                item.classList.add('dark-mode');
            } else {
                item.classList.remove('dark-mode');
            }
        });
        noResultsItems.forEach(item => {
            if (isDarkMode) {
                item.style.color = 'white';
            } else {
                item.style.color = '#333';
            }
        });
    };

    searchInputElement.addEventListener('input', () => {
        const query = searchInputElement.value.trim();
        const searchType = searchTypeElement.value;

        if (query) {
            resultsElement.innerHTML = '';
            loadingIcon.style.display = 'block'; // Mostrar el gif
            fetchResults(query, searchType).then(results => {
                loadingIcon.style.display = 'none'; // Ocultar el gif
                resultsElement.innerHTML = '';
                if (results.length > 0) {
                    displayResults(results, resultsElement);
                } else {
                    displayNoResults(resultsElement);
                }
                updateResultsMode(); // Actualizar el modo de los resultados
            });
        } else {
            resultsElement.innerHTML = '';
            loadingIcon.style.display = 'none'; 
        }
    });

    searchTypeElement.addEventListener('change', () => {
        searchInputElement.value = ''; // Limpiar el campo de búsqueda
        resultsElement.innerHTML = ''; // Limpiar los resultados anteriores
        loadingIcon.style.display = 'none'; // Ocultar el gif
    });

    modeToggle.addEventListener('change', updateMode);

    // Initialize the mode on page load
    updateMode();

    // For dynamically added results
    const observer = new MutationObserver(() => {
        updateResultsMode();
    });

    observer.observe(resultsElement, { childList: true });
});

async function fetchResults(query, type) {
    const endpoint = 'http://localhost:3030/Biblioteca/query';
    let sparqlQuery = '';

    switch (type) {
        case 'encuadernacion':
            sparqlQuery = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX lib: <http://www.semanticweb.org/usuariojp/ontologies/2024/3/BIBLIOTECA#>
            SELECT ?NombreLibro ?Autor ?Genero ?Idioma ?Editorial ?Anio ?Encuadernacion ?ISBN13 WHERE {
                ?x lib:NombreLibro ?NombreLibro.
                ?x lib:ISBN13 ?ISBN13.
                ?x lib:AnioPublicacion ?Anio.
                ?x lib:EscritoPor ?ep.
                ?ep lib:NombreAutor ?Autor.
                ?x lib:TieneGenero ?tg.
                ?tg lib:NombreGenero ?Genero.
                ?x lib:ProducidoPor ?pp.
                ?pp lib:NombreEditorial ?Editorial.
                ?x lib:TieneEncuadernacion ?te.
                ?te lib:NombreEncuadernacion ?Encuadernacion.
                ?x lib:EscritoEn ?ee.
                ?ee lib:NombreIdioma ?Idioma.
                FILTER (REGEX(str(?Encuadernacion), "${query}", 'i'))
            }
            `;
            break;
        case 'editorial':
            sparqlQuery = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX lib: <http://www.semanticweb.org/usuariojp/ontologies/2024/3/BIBLIOTECA#>
            SELECT ?NombreLibro ?Autor ?Genero ?Idioma ?Editorial ?Anio ?Encuadernacion ?ISBN13 WHERE {
                ?x lib:NombreLibro ?NombreLibro.
                ?x lib:ISBN13 ?ISBN13.
                ?x lib:AnioPublicacion ?Anio.
                ?x lib:EscritoPor ?ep.
                ?ep lib:NombreAutor ?Autor.
                ?x lib:TieneGenero ?tg.
                ?tg lib:NombreGenero ?Genero.
                ?x lib:ProducidoPor ?pp.
                ?pp lib:NombreEditorial ?Editorial.
                ?x lib:TieneEncuadernacion ?te.
                ?te lib:NombreEncuadernacion ?Encuadernacion.
                ?x lib:EscritoEn ?ee.
                ?ee lib:NombreIdioma ?Idioma.
                FILTER (REGEX(str(?Editorial), "${query}", 'i'))
            }
            `;
            break;
        case 'anio':
            sparqlQuery = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX lib: <http://www.semanticweb.org/usuariojp/ontologies/2024/3/BIBLIOTECA#>
            SELECT ?NombreLibro ?Autor ?Genero ?Idioma ?Editorial ?Anio ?Encuadernacion ?ISBN13 WHERE {
                ?x lib:NombreLibro ?NombreLibro.
                ?x lib:ISBN13 ?ISBN13.
                ?x lib:AnioPublicacion ?Anio.
                ?x lib:EscritoPor ?ep.
                ?ep lib:NombreAutor ?Autor.
                ?x lib:TieneGenero ?tg.
                ?tg lib:NombreGenero ?Genero.
                ?x lib:ProducidoPor ?pp.
                ?pp lib:NombreEditorial ?Editorial.
                ?x lib:TieneEncuadernacion ?te.
                ?te lib:NombreEncuadernacion ?Encuadernacion.
                ?x lib:EscritoEn ?ee.
                ?ee lib:NombreIdioma ?Idioma.
                FILTER (REGEX(str(?Anio), "${query}", 'i'))
            }
            `;
            break;
        case 'idioma':
            sparqlQuery = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX lib: <http://www.semanticweb.org/usuariojp/ontologies/2024/3/BIBLIOTECA#>
            SELECT ?NombreLibro ?Autor ?Genero ?Idioma ?Editorial ?Anio ?Encuadernacion ?ISBN13 WHERE {
                ?x lib:NombreLibro ?NombreLibro.
                ?x lib:ISBN13 ?ISBN13.
                ?x lib:AnioPublicacion ?Anio.
                ?x lib:EscritoPor ?ep.
                ?ep lib:NombreAutor ?Autor.
                ?x lib:TieneGenero ?tg.
                ?tg lib:NombreGenero ?Genero.
                ?x lib:ProducidoPor ?pp.
                ?pp lib:NombreEditorial ?Editorial.
                ?x lib:TieneEncuadernacion ?te.
                ?te lib:NombreEncuadernacion ?Encuadernacion.
                ?x lib:EscritoEn ?ee.
                ?ee lib:NombreIdioma ?Idioma.
                FILTER (REGEX(str(?Idioma), "${query}", 'i'))
            }
            `;
            break;
        case 'genero':
            sparqlQuery = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX lib: <http://www.semanticweb.org/usuariojp/ontologies/2024/3/BIBLIOTECA#>
            SELECT ?NombreLibro ?Autor ?Genero ?Idioma ?Editorial ?Anio ?Encuadernacion ?ISBN13 WHERE {
                ?x lib:NombreLibro ?NombreLibro.
                ?x lib:ISBN13 ?ISBN13.
                ?x lib:AnioPublicacion ?Anio.
                ?x lib:EscritoPor ?ep.
                ?ep lib:NombreAutor ?Autor.
                ?x lib:TieneGenero ?tg.
                ?tg lib:NombreGenero ?Genero.
                ?x lib:ProducidoPor ?pp.
                ?pp lib:NombreEditorial ?Editorial.
                ?x lib:TieneEncuadernacion ?te.
                ?te lib:NombreEncuadernacion ?Encuadernacion.
                ?x lib:EscritoEn ?ee.
                ?ee lib:NombreIdioma ?Idioma.
                FILTER (REGEX(str(?Genero), "${query}", 'i'))
            }
            `;
            break;
        case 'autor':
            sparqlQuery = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX lib: <http://www.semanticweb.org/usuariojp/ontologies/2024/3/BIBLIOTECA#>
            SELECT ?NombreLibro ?Autor ?Genero ?Idioma ?Editorial ?Anio ?Encuadernacion ?ISBN13 WHERE {
                ?x lib:NombreLibro ?NombreLibro.
                ?x lib:ISBN13 ?ISBN13.
                ?x lib:AnioPublicacion ?Anio.
                ?x lib:EscritoPor ?ep.
                ?ep lib:NombreAutor ?Autor.
                ?x lib:TieneGenero ?tg.
                ?tg lib:NombreGenero ?Genero.
                ?x lib:ProducidoPor ?pp.
                ?pp lib:NombreEditorial ?Editorial.
                ?x lib:TieneEncuadernacion ?te.
                ?te lib:NombreEncuadernacion ?Encuadernacion.
                ?x lib:EscritoEn ?ee.
                ?ee lib:NombreIdioma ?Idioma.
                FILTER (REGEX(str(?Autor), "${query}", 'i'))
            }
            `;
            break;
        case 'isbn':
            sparqlQuery = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX lib: <http://www.semanticweb.org/usuariojp/ontologies/2024/3/BIBLIOTECA#>
            SELECT ?NombreLibro ?Autor ?Genero ?Idioma ?Editorial ?Anio ?Encuadernacion ?ISBN13 WHERE {
                ?x lib:NombreLibro ?NombreLibro.
                ?x lib:ISBN13 ?ISBN13.
                ?x lib:AnioPublicacion ?Anio.
                ?x lib:EscritoPor ?ep.
                ?ep lib:NombreAutor ?Autor.
                ?x lib:TieneGenero ?tg.
                ?tg lib:NombreGenero ?Genero.
                ?x lib:ProducidoPor ?pp.
                ?pp lib:NombreEditorial ?Editorial.
                ?x lib:TieneEncuadernacion ?te.
                ?te lib:NombreEncuadernacion ?Encuadernacion.
                ?x lib:EscritoEn ?ee.
                ?ee lib:NombreIdioma ?Idioma.
                FILTER (REGEX(str(?ISBN13), "${query}", 'i'))
            }
            `;
            break;
        case 'nombreLibro':
            sparqlQuery = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX lib: <http://www.semanticweb.org/usuariojp/ontologies/2024/3/BIBLIOTECA#>
            SELECT ?NombreLibro ?Autor ?Genero ?Idioma ?Editorial ?Anio ?Encuadernacion ?ISBN13 WHERE {
                ?x lib:NombreLibro ?NombreLibro.
                ?x lib:ISBN13 ?ISBN13.
                ?x lib:AnioPublicacion ?Anio.
                ?x lib:EscritoPor ?ep.
                ?ep lib:NombreAutor ?Autor.
                ?x lib:TieneGenero ?tg.
                ?tg lib:NombreGenero ?Genero.
                ?x lib:ProducidoPor ?pp.
                ?pp lib:NombreEditorial ?Editorial.
                ?x lib:TieneEncuadernacion ?te.
                ?te lib:NombreEncuadernacion ?Encuadernacion.
                ?x lib:EscritoEn ?ee.
                ?ee lib:NombreIdioma ?Idioma.
                FILTER (REGEX(str(?NombreLibro), "${query}", 'i'))
            }
            `;
            break;
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
        },
        body: sparqlQuery
    });

    const json = await response.json();
    return json.results.bindings;
}

async function displayResults(results, container) {
    for (const result of results) {
        const div = document.createElement('div');
        div.className = 'result';
        div.innerHTML = `
            <img src="gif/cover.jpg" alt="${result.NombreLibro.value}">
            <h3>${result.NombreLibro.value}</h3>
            <p>Autor: ${result.Autor.value}</p>
            <p>Género: ${result.Genero.value}</p>
            <p>Idioma: ${result.Idioma.value}</p>
            <p>Editorial: ${result.Editorial.value}</p>
            <p>Año: ${result.Anio.value}</p>
            <p>Encuadernación: ${result.Encuadernacion.value}</p>
            <p>ISBN13: ${result.ISBN13.value}</p>
        `;
        container.appendChild(div);
    }
    updateResultsMode(); // Actualizar el modo de los resultados después de agregarlos
}

function displayNoResults(container) {
    const div = document.createElement('div');
    div.className = 'no-results';
    div.innerHTML = `
        <img src="gif/404.png" alt="No hay resultados" style="max-width: 300px; margin: 20px auto; display: block;">
        <p style="text-align: center; font-family: 'Roboto', sans-serif; font-size: 16px;">No hay resultados</p>
    `;
    container.appendChild(div);
}

function updateResultsMode() {
    const resultsItems = document.querySelectorAll('.result');
    const noResultsItems = document.querySelectorAll('.no-results p');
    const isDarkMode = document.getElementById('modeToggle').checked;
    resultsItems.forEach(item => {
        if (isDarkMode) {
            item.classList.add('dark-mode');
        } else {
            item.classList.remove('dark-mode');
        }
    });
    noResultsItems.forEach(item => {
        if (isDarkMode) {
            item.style.color = 'white';
        } else {
            item.style.color = '#333';
        }
    });
}