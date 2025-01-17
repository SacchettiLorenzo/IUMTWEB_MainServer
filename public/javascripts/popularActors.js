document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('actorsChart').getContext('2d');

    // Dati iniziali degli attori (passati dal backend)
    const actors = JSON.parse(document.getElementById('actorsData').textContent);

    // Dati per il grafico
    const labels = actors.map(actor => actor.name);
    const data = actors.map(actor => actor.actor_count);

    // Crea il grafico
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Movies',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.raw} movies`
                    }
                }
            },
            onClick: (e) => {
                const points = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
                if (points.length) {
                    const index = points[0].index;
                    updateActorCard(actors[index]);
                }
            }
        }
    });

    // Funzione per aggiornare la scheda dinamica
    const updateActorCard = (actor) => {
        document.getElementById('actorImage').src = actor.imageUrl || '/public/images/default_actor.png';
        document.getElementById('actorLink').textContent = actor.name;
        document.getElementById('actorLink').href = `/actors/id?id=${actor.id}`;
        document.getElementById('actorMovies').textContent = `Movies: ${actor.actor_count}`;
    };

    // Mostra il primo attore come predefinito
    updateActorCard(actors[0]);
});