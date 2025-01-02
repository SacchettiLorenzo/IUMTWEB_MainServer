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