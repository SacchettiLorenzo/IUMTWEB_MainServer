async function fetchSuggestions() {
    const query = document.getElementById('search-input').value.trim();
    const suggestionsBox = document.getElementById('suggestions');

    if (query.length < 2) {
        suggestionsBox.innerHTML = ''; // Nascondi suggerimenti se la query è troppo breve
        return;
    }

    try {
        const response = await fetch(`/search?query=${query}&entity=movies`);
        const results = await response.json();

        suggestionsBox.innerHTML = results
            .map(item => `<a href="/movies/id?id=${item.id}" class="list-group-item list-group-item-action">${item.name}</a>`)
            .join('');
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        suggestionsBox.innerHTML = '<p class="text-danger">Errore durante la ricerca</p>';
    }
}