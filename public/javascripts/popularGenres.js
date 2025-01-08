document.addEventListener("DOMContentLoaded", async () => {
    const chartCanvas = document.getElementById("popularGenresChart").getContext("2d");

    try {

        const response = await axios.get("/popular-genres");
        const genres = response.data;

        console.log("Genres data:", genres);

        if (!genres || genres.length === 0) {
            console.error("No genres found.");
            return;
        }

        const genreLabels = genres.map(genre => genre.genre);
        const movieCounts = genres.map(genre => genre.movieCount);

        const maxMovies = Math.max(...movieCounts);
        const maxDisplayValue = 1000;

        const scalingFactor = maxMovies > maxDisplayValue ? maxMovies / maxDisplayValue : 1;

        const displayCounts = movieCounts.map(count => (scalingFactor > 1 ? count / scalingFactor : count));

        console.log("Genre labels:", genreLabels);
        console.log("Original movie counts:", movieCounts);
        console.log("Scaled movie counts:", displayCounts);

        // Configurazione del grafico a istogramma
        const chart = new Chart(chartCanvas, {
            type: "bar",
            data: {
                labels: genreLabels,
                datasets: [{
                    label: "Number of Movies",
                    data: displayCounts,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Genre"
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 10,
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Number of Movies"
                        },
                        beginAtZero: true,
                        ticks: {
                            max: maxDisplayValue,  // Imposta il valore massimo della y-axis
                            callback: function(value) {
                                return value > 1000 ? value / 1000 + 'K' : value; // Converte in K per numeri grandi
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const index = tooltipItem.dataIndex;
                                return `${genreLabels[index]}: ${movieCounts[index]} movies`;
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error loading popular genres:", error);
    }
});
