document.addEventListener("DOMContentLoaded", async () => {
    const chartCanvas = document.getElementById("popularMoviesChart").getContext("2d");
    const detailsSection = document.getElementById("movieDetails");
    const moviePoster = document.getElementById("moviePoster");
    const movieTitle = document.getElementById("movieTitle");
    const movieDescription = document.getElementById("movieDescription");
    const movieRating = document.getElementById("movieRating").querySelector("span");

    try {
        const response = await axios.get("/popular-movies"); // Utilizza la rotta aggiornata
        const movies = response.data;

        if (!movies || movies.length === 0) {
            throw new Error("No popular movies found.");
        }

        // Ordiniamo i film per anno
        const sortedMovies = movies.sort((a, b) => a.year - b.year);

        // Preparazione dei dati per il grafico scatter
        const scatterData = sortedMovies.map(movie => ({
            x: movie.year,
            y: movie.rating,
            movie: movie, // Conserva i dettagli del film
        }));

        // Configurazione del grafico scatter
        const chart = new Chart(chartCanvas, {
            type: "scatter",
            data: {
                datasets: [{
                    label: "Popular Movies",
                    data: scatterData,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    pointRadius: 5,
                    pointHoverRadius: 7,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const movie = scatterData[tooltipItem.dataIndex].movie;
                                return `${movie.name} (Rating: ${movie.rating})`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: "linear",
                        position: "bottom",
                        title: {
                            display: true,
                            text: "Year"
                        },
                        ticks: {
                            callback: value => value.toFixed(0) // Mostra solo numeri interi
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Rating"
                        },
                        min: 4, // Imposta il minimo a 4 per rispettare il filtro
                        max: 5,
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        const selectedMovie = scatterData[index].movie;
                        displayMovieDetails(selectedMovie);
                    }
                }
            }
        });

        // Funzione per mostrare i dettagli del film
        function displayMovieDetails(movie) {
            moviePoster.src = movie.poster || "/images/default-movie.png";
            movieTitle.textContent = movie.name;
            movieDescription.textContent = movie.description || "No description available.";
            movieRating.textContent = movie.rating.toFixed(1);
            detailsSection.style.display = "block"; // Mostra la sezione dettagli
        }
    } catch (error) {
        console.error("Error loading popular movies:", error);
    }
});