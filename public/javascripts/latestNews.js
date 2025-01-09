document.addEventListener('DOMContentLoaded', async () => {
    const newsList = document.getElementById('news-list');

    try {
        const response = await axios.get('/news'); // Chiamata alla route del backend
        const news = response.data.slice(0, 5); // Limitiamo a 5 notizie

        if (!news || news.length === 0) {
            newsList.innerHTML = '<p class="text-center">No news available at the moment.</p>';
            return;
        }

        // Crea dinamicamente gli elementi della lista
        news.forEach(item => {
            const newsItem = document.createElement('a');
            newsItem.href = item.link;
            newsItem.target = '_blank'; // Apre il link in una nuova scheda
            newsItem.classList.add('list-group-item', 'list-group-item-action');
            newsItem.innerHTML = `
                <h5>${item.title}</h5>
                <p>${item.description}</p>
                <small class="text-muted">Published: ${new Date(item.pubDate).toLocaleDateString()}</small>
            `;
            newsList.appendChild(newsItem);
        });
    } catch (error) {
        console.error('Error loading news:', error.message);
        newsList.innerHTML = '<p class="text-center text-danger">Failed to load news.</p>';
    }
});