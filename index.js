const $movieName = document.getElementById('input-search')
const $searchBtn = document.getElementById('search-btn')
const $movieWrapper = document.getElementById('movie-wrapper')
const $linkMyWatchlist = document.getElementById('link-my-watchlist')

let myMovieList = JSON.parse(localStorage.getItem('movieList')) ? JSON.parse(localStorage.getItem('movieList')) : []

$searchBtn.addEventListener('click', async function() {
    if(!$movieName.value) return
    const movieList = await getMovieList($movieName.value)   
    const hasMovieList = movieList.Response === 'False' ? false : true
    if(hasMovieList) {    
        $movieWrapper.innerHTML = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>'                    
        renderSearch(movieList.Search)        
    }else {
        $movieWrapper.innerHTML = `
            <p class="no-film-list">Unable to find what you’re looking for. Please try another search.</p>
        `
        $movieWrapper.style.marginTop = '50vh'
    }    
    $movieName.value = ''
})

async function getMovieList(name) { 
    $movieWrapper.innerHTML = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>'                       
    const response = await fetch(`https://www.omdbapi.com/?apikey=b6d4b842&s=${name}`)
    return await response.json()    
}

function renderSearch(arr) {
    let html = ``
    arr.forEach(movie => {
        fetch(`https://www.omdbapi.com/?apikey=b6d4b842&i=${movie.imdbID}&type=movie`)
            .then(response => response.json())
            .then(dataMovie => {                
                html += `
                    <li>
                        <div class="movie-container">
                            <div class="image-wrapper">
                                <img class="image" src=${dataMovie.Poster}>
                            </div>

                            <div class="description">
                                <div class="title">
                                    <h3>${dataMovie.Title}</h3>
                                    <svg width="13" height="12" class="star" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path id="Icon" d="M5.78671 1.19529C6.01122 0.504306 6.98878 0.504305 7.21329 1.19529L8.01547 3.66413C8.11588 3.97315 8.40384 4.18237 8.72876 4.18237H11.3247C12.0512 4.18237 12.3533 5.11208 11.7655 5.53913L9.66537 7.06497C9.40251 7.25595 9.29251 7.59447 9.39292 7.90349L10.1951 10.3723C10.4196 11.0633 9.62875 11.6379 9.04097 11.2109L6.94084 9.68503C6.67797 9.49405 6.32203 9.49405 6.05916 9.68503L3.95903 11.2109C3.37125 11.6379 2.58039 11.0633 2.8049 10.3723L3.60708 7.90349C3.70749 7.59448 3.59749 7.25595 3.33463 7.06497L1.2345 5.53914C0.646715 5.11208 0.948796 4.18237 1.67534 4.18237H4.27124C4.59616 4.18237 4.88412 3.97315 4.98453 3.66414L5.78671 1.19529Z" fill="#FEC654"/>
                                    </svg>
                                    <span class="rating">${dataMovie.imdbRating}</span>
                                </div>

                                <div class="atributes">
                                    <div class="runtime">${dataMovie.Runtime}</div>
                                    <div class="genre">${dataMovie.Genre}</div>
                                    <div class="add-movie-wrapper">
                                        <div class="add-movie-btn" id=${dataMovie.imdbID}>+</div>
                                        <div class="add">Watchlist</div>
                                    </div>
                                </div>

                                <div class="plot">${dataMovie.Plot}</div>
                            </div>                        
                        </div>
                    </li>                    
                `
                $movieWrapper.innerHTML = `<ul>${html}</ul>`
                $movieWrapper.style.marginTop = '230px'                
            })
    });
}

document.body.addEventListener('click', event => {     
    if(event.target.closest('.add-movie-btn')){
        addMovieToLocalstorage(event)
    } 
    else if(event.target.closest('.remove-movie-btn')) {
        removeMovieFromLocalstorage(event)
    } 
    else if(event.target.id === "add-some-movies-plus" || event.target.id === 'add-some-movies') {
        startPage()
    }  
})

function addMovieToLocalstorage(event) {  // ADDING MOVIE TO LOCALSTORAGE    
    if (!event.target.matches('.add-movie-btn')) return
    fetch(`https://www.omdbapi.com/?apikey=b6d4b842&i=${event.target.id}&type=movie`)
        .then(response => response.json())
        .then(movie => {            
            let count = 0
            myMovieList.forEach(data => {
                if(data.imdbID === movie.imdbID){
                    count ++
                }
            })
            if (count === 0) {
                myMovieList.push(movie)
                localStorage.setItem('movieList',JSON.stringify(myMovieList))
            }                        
        })
}

function removeMovieFromLocalstorage(event) {  //REMOVING MOVIE FROM LOCALSTORAGE    
    if (!event.target.matches('.remove-movie-btn')) return
    myMovieList.splice(myMovieList.findIndex(movie => movie.imdbID === event.target.id), 1)
    localStorage.setItem('movieList',JSON.stringify(myMovieList))
    renderMyWatchlist(myMovieList)
}


$linkMyWatchlist.addEventListener('click', function() {
    if(this.innerText === 'My Watchlist') {
        document.getElementById('search-wrapper-out').style.display = 'none'
        renderMyWatchlist(myMovieList)         
        document.getElementsByTagName('h1')[0].textContent = 'My Watchlist' 
        $linkMyWatchlist.textContent = 'Find your film'
    } else {        
        startPage()
    }    
})

function renderMyWatchlist(arr) {    
    if(myMovieList.length) {
        $movieWrapper.innerHTML = arr.map(movie => {
            return `
                <ul>
                    <li>
                        <div class="movie-container">
                            <div class="image-wrapper">
                                <img class="image" src=${movie.Poster}>
                            </div>

                            <div class="description">
                                <div class="title">
                                    <h3>${movie.Title}</h3>
                                    <svg width="13" height="12" class="star" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path id="Icon" d="M5.78671 1.19529C6.01122 0.504306 6.98878 0.504305 7.21329 1.19529L8.01547 3.66413C8.11588 3.97315 8.40384 4.18237 8.72876 4.18237H11.3247C12.0512 4.18237 12.3533 5.11208 11.7655 5.53913L9.66537 7.06497C9.40251 7.25595 9.29251 7.59447 9.39292 7.90349L10.1951 10.3723C10.4196 11.0633 9.62875 11.6379 9.04097 11.2109L6.94084 9.68503C6.67797 9.49405 6.32203 9.49405 6.05916 9.68503L3.95903 11.2109C3.37125 11.6379 2.58039 11.0633 2.8049 10.3723L3.60708 7.90349C3.70749 7.59448 3.59749 7.25595 3.33463 7.06497L1.2345 5.53914C0.646715 5.11208 0.948796 4.18237 1.67534 4.18237H4.27124C4.59616 4.18237 4.88412 3.97315 4.98453 3.66414L5.78671 1.19529Z" fill="#FEC654"/>
                                    </svg>
                                    <span class="rating">${movie.imdbRating}</span>
                                </div>

                                <div class="atributes">
                                    <div class="runtime">${movie.Runtime}</div>
                                    <div class="genre">${movie.Genre}</div>
                                    <div class="add-movie-wrapper">
                                        <div class="remove-movie-btn" id=${movie.imdbID}>-</div>
                                        <div class="add">Remove</div>
                                    </div>
                                </div>

                                <div class="plot">${movie.Plot}</div>
                            </div>                        
                        </div>
                    </li> 
                </ul>
            `
        }).join('')  
        $movieWrapper.style.marginTop = '208px'                    
    } else {
        $movieWrapper.innerHTML = `
            <p class="no-film-list">Your watchlist is looking a little empty...</p>
            <div id="add-some-movies">
                <span id="add-some-movies-plus">+</span>Let's add some movies!
            </div>
        `
        $movieWrapper.style.marginTop = '50vh'
    }       
}

function startPage() {
    document.getElementById('search-wrapper-out').style.display = 'block'
    $movieWrapper.innerHTML = `
        <div class="icon">
            <svg width="70" height="62" viewBox="0 0 70 62" class="no-film-list" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path id="Icon" fill-rule="evenodd" clip-rule="evenodd" d="M8.75 0C3.91751 0 0 3.9175 0 8.75V52.5C0 57.3325 3.91751 61.25 8.75 61.25H61.25C66.0825 61.25 70 57.3325 70 52.5V8.75C70 3.9175 66.0825 0 61.25 0H8.75ZM21.875 8.75H48.125V26.25H21.875V8.75ZM56.875 43.75V52.5H61.25V43.75H56.875ZM48.125 35H21.875V52.5H48.125V35ZM56.875 35H61.25V26.25H56.875V35ZM61.25 17.5V8.75H56.875V17.5H61.25ZM13.125 8.75V17.5H8.75V8.75H13.125ZM13.125 26.25H8.75V35H13.125V26.25ZM8.75 43.75H13.125V52.5H8.75V43.75Z" fill="#2E2E2F"/>
            </svg>
        </div>   
        <p class="no-film-list">Start exploring</p> 
    `
    document.getElementsByTagName('h1')[0].textContent = 'Find your film' 
    $linkMyWatchlist.textContent = 'My Watchlist'
    $movieWrapper.style.marginTop = '50vh'
}