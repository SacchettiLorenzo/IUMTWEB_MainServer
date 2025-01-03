function load_default_actor_image(ImgElement){
    ImgElement.setAttribute('src', "/public/images/default_actor.png");
}

function load_default_movie_image(ImgElement){
    ImgElement.setAttribute('src', "/public/images/default_movie.png");
}

window.onload = function(){
    document.getElementById("MovieCarouselInner").children[0].classList.add('active');
    document.getElementById("MovieCarouselIndicators").children[0].classList.add('active');
}

function filter_table(inputElement, table){
    var filter = inputElement.value.toUpperCase();
    console.log(table);
    var tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

let tableTemplate;

async function sendMovieSearch(){

    if(tableTemplate == null){
        await loadTableTemplate();
    }

    document.getElementById("searchResult").style.display = "none";

    const country = document.getElementById("countrySelect").value;
    const genre = document.getElementById("genreSelect").value;
    const language = document.getElementById("languageSelect").value;
    const theme = document.getElementById("themeSelect").value;
    const date = document.getElementById("dateInput").value;

    let res = document.getElementById("searchResult");

    axios.get("/movies/filter", {params : {country : country, genre : genre, language : language,theme: theme, date:date}}).then((response) => {
        console.log(response.data);
        res.innerHTML = tableTemplate({movies : response.data});
        res.style.display = "block";
    })
}

function loadTableTemplate(){
    axios.get("/movies/filter/table").then((response) => {
        tableTemplate = Handlebars.compile(response.data);
    })
}