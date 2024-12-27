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