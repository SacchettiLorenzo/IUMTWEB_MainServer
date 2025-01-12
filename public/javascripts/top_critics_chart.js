document.addEventListener("DOMContentLoaded", async () => {
    const chartCanvas = document.getElementById("topCriticsChart").getContext("2d");

    try {
        const response = await axios.get("/popular-critics");
        const critics = response.data;

        const labels = critics.map(c => c._id);
        const dataValues = critics.map(c => c.totalReviews);

        console.log("Chart labels:", labels);
        console.log("Chart data:", dataValues);

        new Chart(chartCanvas, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Total Reviews",
                    data: dataValues,
                    backgroundColor: "rgba(54, 162, 235, 0.5)",
                    borderColor: "rgba(54, 162, 235, 1)",
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
        console.error("Error loading top critics:", error);
    }
});
