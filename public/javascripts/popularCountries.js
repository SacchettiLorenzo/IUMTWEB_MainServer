document.addEventListener("DOMContentLoaded", async () => {
    const chartCanvas = document.getElementById("popularCountriesChart").getContext("2d");

    try {

        const response = await axios.get("/popular-countries");
        const countries = response.data;

        console.log("Countries data:", countries);

        if (!countries || countries.length === 0) {
            console.error("No countries found.");
            return;
        }

        const countryLabels = countries.map(country => country.name);
        const movieCounts = countries.map(country => country.movieCount);

        console.log("Country labels:", countryLabels);
        console.log("Movie counts:", movieCounts);

        const totalMovies = movieCounts.reduce((total, count) => total + count, 0);
        const moviePercentages = movieCounts.map(count => ((count / totalMovies) * 100).toFixed(2));

        console.log("Movie percentages:", moviePercentages);

        // Configurazione del grafico a torta
        const chart = new Chart(chartCanvas, {
            type: "pie",
            data: {
                labels: countryLabels,
                datasets: [{
                    data: movieCounts,
                    backgroundColor: [
                        "#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#E74C3C",
                        "#9B59B6", "#34495E", "#1ABC9C", "#2ECC71", "#F39C12"
                    ],
                    hoverBackgroundColor: [
                        "#FF6F61", "#33FF61", "#3366FF", "#F1D60C", "#E84F4B",
                        "#9C60B8", "#546E7A", "#16C6A2", "#32E36C", "#F4A916"
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const index = tooltipItem.dataIndex;
                                return `${countryLabels[index]}: ${moviePercentages[index]}% (${movieCounts[index]} movies)`;
                            }
                        }
                    },
                    legend: {
                        position: "top",
                        labels: {
                            boxWidth: 20
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error loading popular countries:", error);
    }
});
