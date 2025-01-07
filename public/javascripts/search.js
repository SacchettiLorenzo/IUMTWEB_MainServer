document.addEventListener('keydown', (event) => {
    const suggestionsBox = document.getElementById('suggestions');
    if (event.key === 'Escape') {
        suggestionsBox.innerHTML = ''; // Svuota la tendina
        suggestionsBox.style.display = 'none'; // Nascondi la tendina
    }
});

async function performSearch(event) {
    event.preventDefault(); // Evita il reload della pagina

    const query = document.getElementById('search-input').value.trim();
    const suggestionsBox = document.getElementById('suggestions');
    const suggestionsContent = document.getElementById('suggestions-content');

    // Reset della tendina
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';

    if (!query) {
        return;
    }

    try {
        const response = await fetch(`/search?query=${encodeURIComponent(query)}`);
        const results = await response.json();

        if (!results || results.length === 0) {
            suggestionsBox.innerHTML = '<p class="text-muted">Nessun risultato trovato</p>';
            suggestionsBox.style.display = 'block'; // Mostra comunque la tendina
            return;
        }

        // Costruisce i filtri e i risultati
        suggestionsBox.innerHTML = `
            <div class="filter-container">
                <button class="filter-btn" onclick="filterResults('movie')">Movies</button>
                <button class="filter-btn" onclick="filterResults('actor')">Actors</button>
            </div>
            <div id="suggestions-content">
                ${results
            .map(
                (item) =>
                    `<a href="${
                        item.type === 'movie' ? '/movies/id' : '/actors/id'
                    }?id=${item.id}" 
                               class="list-group-item list-group-item-action" 
                               data-type="${item.type}">
                                ${item.name} (${item.type === 'movie' ? 'Film' : 'Attore'})
                             </a>`
            )
            .join('')}
            </div>
        `;
        suggestionsBox.style.display = 'block'; // Mostra la tendina
    } catch (error) {
        console.error('Error during search:', error);
        suggestionsBox.innerHTML = '<p class="text-danger">Errore durante la ricerca</p>';
        suggestionsBox.style.display = 'block';
    }
}

function filterResults(type) {
    const items = document.querySelectorAll('#suggestions-content .list-group-item');
    items.forEach((item) => {
        // Filtra i risultati basandosi sull'attributo data-type
        item.style.display = item.dataset.type === type ? 'block' : 'none';
    });
}