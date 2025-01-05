async function fetchSuggestions() {
    const query = document.getElementById('search-input').value.trim();
    const suggestionsBox = document.getElementById('suggestions');

    if (query.length < 2) {
        suggestionsBox.innerHTML = ''; // Nascondi suggerimenti se la query è troppo breve
        return;
    }

    try {
        const response = await fetch(`/search?query=${query}`);
        const results = await response.json();

        if (!results || results.length === 0) {
            suggestionsBox.innerHTML = '<p class="text-muted">Nessun risultato trovato</p>';
            return;
        }

        suggestionsBox.innerHTML = results
            .map(item =>
                `<a href="${item.type === 'movie' ? '/movies/id' : '/actors/id'}?id=${item.id}" 
                   class="list-group-item list-group-item-action">
                   ${item.name} (${item.type === 'movie' ? 'Film' : 'Attore'})
                 </a>`)
            .join('');
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        suggestionsBox.innerHTML = '<p class="text-danger">Errore durante la ricerca</p>';
    }
}