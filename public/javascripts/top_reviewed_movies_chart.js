document.addEventListener("DOMContentLoaded", async () => {
    const chartCanvas = document.getElementById("topMoviesChart").getContext("2d");

    try {
        const response = await axios.get("/popular-reviewed-movies");
        const movies = response.data;

        console.log("Movies data received:", movies);

        const labels = movies.map(m => m.movie_title);
        const dataValues = movies.map(m => m.criticsCount);

        console.log("Chart labels:", labels);
        console.log("Chart data:", dataValues);

        new Chart(chartCanvas, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Number of Distinct Critics",
                    data: dataValues,
                    backgroundColor: "rgba(75, 192, 192, 0.5)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } catch (error) {
        console.error("Error loading top reviewed movies:", error);
    }
});
