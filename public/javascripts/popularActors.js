document.addEventListener("DOMContentLoaded", async () => {
    const chartCanvas = document.getElementById("popularActorsChart").getContext("2d");
    const detailsSection = document.getElementById("actorDetails");
    const actorPhoto = document.getElementById("actorPhoto");
    const actorName = document.getElementById("actorName");
    const actorPopularity = document.getElementById("actorPopularity").querySelector("span");

    try {
        const response = await axios.get("/popular-actors"); // Chiamata alla route
        const actors = response.data;

        if (!actors || actors.length === 0) {
            throw new Error("No popular actors found.");
        }

        // Preparazione dei dati per il grafico a barre
        const barData = actors.map(actor => ({
            label: actor.name,
            data: actor.popularity,
            actor: actor, // Conserva i dettagli dell'attore
        }));

        // Configurazione del grafico a barre
        const chart = new Chart(chartCanvas, {
            type: "bar",
            data: {
                labels: barData.map(data => data.label),
                datasets: [{
                    label: "Popularity",
                    data: barData.map(data => data.data),
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const actor = barData[tooltipItem.dataIndex].actor;
                                return `${actor.name} (Popularity: ${actor.popularity})`;
                            }
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        const selectedActor = barData[index].actor;
                        displayActorDetails(selectedActor);
                    }
                }
            }
        });

        // Funzione per mostrare i dettagli dell'attore
        function displayActorDetails(actor) {
            actorPhoto.src = actor.photo;
            actorName.textContent = actor.name;
            actorPopularity.textContent = actor.popularity.toFixed(1);
            detailsSection.style.display = "block"; // Mostra la sezione dettagli
        }
    } catch (error) {
        console.error("Error loading popular actors:", error);
    }
});