document.addEventListener("DOMContentLoaded", async () => {
    const chartCanvas = document.getElementById("nominationsChart").getContext("2d");

    try {
        // Ottieni i dati JSON
        const films = JSON.parse(document.getElementById("nominationsData").textContent);

        console.log("Dati dei film caricati:", films);

        if (!films || films.length === 0) {
            throw new Error("No nominated films found.");
        }

        // Configurazione del grafico
        new Chart(chartCanvas, {
            type: "bar",
            data: {
                labels: films.map(film => film._id), // Titoli dei film
                datasets: [{
                    label: "Total Nominations",
                    data: films.map(film => film.totalNominations),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
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
                                return `${film._id}: ${film.totalNominations} nominations`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Film Title"
                        },
                        ticks: {
                            autoSkip: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Nominations"
                        },
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error loading nominated films:", error);
    }
});