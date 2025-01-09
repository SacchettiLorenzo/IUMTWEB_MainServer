document.addEventListener("DOMContentLoaded", async () => {
    const chartCanvas = document.getElementById("topFilmsChart").getContext("2d");

    try {
        // Ottieni i dati JSON
        const films = JSON.parse(document.getElementById("topFilmsData").textContent);

        console.log("Dati dei film caricati:", films);

        if (!films || films.length === 0) {
            throw new Error("No top films found.");
        }

        // Configurazione del grafico
        new Chart(chartCanvas, {
            type: "bar",
            data: {
                labels: films.map(film => film._id), // Titoli dei film
                datasets: [{
                    label: "Total Wins",
                    data: films.map(film => film.totalWins),
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                const film = films[tooltipItem.dataIndex];
                                return `${film._id}: ${film.totalWins} wins`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Movie Title"
                        },
                        ticks: {
                            autoSkip: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Wins"
                        },
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error loading top films:", error);
    }
});