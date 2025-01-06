document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeSuggestions();
    }
});

document.addEventListener('click', (event) => {
    const movieSuggestionsBox = document.getElementById('movieSuggestions');
    const actorSuggestionsBox = document.getElementById('actorSuggestions');

    // Se il click è fuori dalla tendina e dagli input, chiudi le tendine
    if (!movieSuggestionsBox.contains(event.target) && !actorSuggestionsBox.contains(event.target) &&
        !document.getElementById('movieTitle').contains(event.target) &&
        !document.getElementById('actorName').contains(event.target)) {
        closeSuggestions();
    }
});

function closeSuggestions() {
    const movieSuggestionsBox = document.getElementById('movieSuggestions');
    const actorSuggestionsBox = document.getElementById('actorSuggestions');

    movieSuggestionsBox.style.display = 'none';
    actorSuggestionsBox.style.display = 'none';
    movieSuggestionsBox.innerHTML = ''; // Svuota i suggerimenti
    actorSuggestionsBox.innerHTML = ''; // Svuota i suggerimenti
}

async function validateEntity(event) {
    event.preventDefault(); // Blocca temporaneamente il submit

    const topic = document.getElementById('topic').value;
    const movieTitle = document.getElementById('movieTitle').value.trim();
    const actorName = document.getElementById('actorName').value.trim();

    let query = '';
    let endpoint = '';
    let validationMessage = null;
    let suggestionsBox;

    if (topic === 'movies' && movieTitle) {
        query = movieTitle;
        endpoint = 'movies';
        validationMessage = document.getElementById('movieValidationMessage');
        suggestionsBox = document.getElementById('movieSuggestions');
    } else if (topic === 'actors' && actorName) {
        query = actorName;
        endpoint = 'actors';
        validationMessage = document.getElementById('actorValidationMessage');
        suggestionsBox = document.getElementById('actorSuggestions');
    }

    if (!query) {
        alert('Please select a valid topic and enter a name.');
        return false;
    }

    try {
        // Esegui la ricerca per popolare i suggerimenti
        const response = await fetch(`/search?query=${encodeURIComponent(query)}&entity=${endpoint}`);
        const results = await response.json();

        if (!results || results.length === 0) {
            validationMessage.textContent = `No matching ${endpoint === 'movies' ? 'movie' : 'actor'} found.`;
            suggestionsBox.style.display = 'none'; // Nasconde la tendina se non ci sono risultati
            suggestionsBox.innerHTML = ''; // Svuota i suggerimenti
            return false;
        }

        // Popola i suggerimenti nella tendina
        suggestionsBox.innerHTML = results
            .map(item =>
                `<a href="#" class="list-group-item list-group-item-action" onclick="selectSuggestion('${endpoint}', '${item.name}', event)">${item.name}</a>`
            )
            .join('');
        suggestionsBox.style.display = 'block'; // Mostra la tendina dei suggerimenti

        validationMessage.textContent = ''; // Clear validation message
        return false; // Blocca la sottomissione fino a quando non viene selezionato un suggerimento
    } catch (error) {
        console.error('Error validating entity:', error);
        alert('An error occurred. Please try again.');
        return false;
    }
}

function toggleFields() {
    const topic = document.getElementById('topic').value;
    const movieField = document.getElementById('movieField');
    const actorField = document.getElementById('actorField');

    movieField.style.display = topic === 'movies' ? 'block' : 'none';
    actorField.style.display = topic === 'actors' ? 'block' : 'none';

    // Reset validation messages
    document.getElementById('movieValidationMessage').textContent = '';
    document.getElementById('actorValidationMessage').textContent = '';
}



function selectSuggestion(entity, name, event) {
    event.preventDefault(); // Previene il comportamento predefinito del link

    const inputField = document.getElementById(entity === 'movies' ? 'movieTitle' : 'actorName');
    const suggestionsBox = document.getElementById(entity === 'movies' ? 'movieSuggestions' : 'actorSuggestions');

    // Imposta il valore selezionato nell'input
    inputField.value = name;
    suggestionsBox.innerHTML = ''; // Svuota la tendina
    suggestionsBox.style.display = 'none'; // Nascondi la tendina

    // Procedo con il submit del form
    document.getElementById('channelForm').submit();
}