// your here here
document.addEventListener("DOMContentLoaded", () => { // addEventlistener to loadDom
    let currentMovieId; // declare variables
    let currentTicketsSold; // ''
    let currentCapacity; // ''
    // Function to fetch movie details
    function getMovieDetails() {
        fetch('http://localhost:3000/films/1') // json server url
            .then(response => response.json())
            .then(movie => {
                // store:
                currentMovieId = movie.id; // movie.id
                currentTicketsSold = movie.tickets_sold; // tickets sold
                currentCapacity = movie.capacity; // capacity
                updateMovieDetails(movie); /*function to update movie details*/ })
            // an error alert if failed to fetch
            .catch(error => console.error('Error fetching movie details:', error));}
    // the following will update movie details in DOM
    function updateMovieDetails(movie) {
        const availableTickets = movie.capacity - movie.tickets_sold;
        // overwrite the doc using the textContent
        document.getElementById('movie-title').textContent = movie.title;
        document.getElementById('movie-runtime').textContent = movie.runtime;
        // get all elements with their names from html
        document.getElementById('movie-showtime').textContent = movie.showtime;
        document.getElementById('movie-tickets').textContent = availableTickets;
        document.getElementById('film-info').textContent = movie.description;
        document.getElementById('movie-poster').src = movie.poster;
        // event listener to buy button
        const buyButton = document.getElementById("buy-ticket");
        buyButton.onclick = () => {
            // onclick, the button will do the following
            if (availableTickets > 0) {
                updateTicketsSold(currentMovieId, currentTicketsSold + 1);
            } else {
                alert('No more tickets available for this movie.'); // give alert
            }
        };}
    // Function to fetch all movies and populate the movie menu set
    function getAllMovies() {
        fetch('http://localhost:3000/films') // set the json url
            .then(response => response.json())
            .then(movies => {
                const filmsList = document.getElementById('films');
                filmsList.innerHTML = '';
                // Loop on the movie data
                // create a listing item for each film
                movies.forEach(movie => {
                    const li = document.createElement('li');
                    li.classList.add('film', 'item');
                    li.textContent = movie.title;
                    // click event will load when clicked on
                    li.addEventListener('click', () => displayMovieDetails(movie));
                    // add (append item) the list item to the films menu
                    filmsList.appendChild(li);
                });})
            .catch(error => console.error('Error fetching movies:', error));
    }
    // Function to display movie details in the movie-details part
    function displayMovieDetails(movie) {
        // store the following
        currentMovieId = movie.id; // movie id
        currentTicketsSold = movie.tickets_sold; // ticket sold
        currentCapacity = movie.capacity; // capacity
        updateMovieDetails(movie); // function for movie details
    }
    // Function to update the server when tickets are sold
    function updateTicketsSold(movieId, newTicketsSold) {
        fetch(`http://localhost:3000/films/${movieId}`, { // Added backticks around the URL
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tickets_sold: newTicketsSold,
            }),})
        .then(response => response.json())
        .then(updatedMovie => {
            // Update UI after ticket purchase
            currentTicketsSold = updatedMovie.tickets_sold; // Update current tickets sold
            const availableTickets = updatedMovie.capacity - updatedMovie.tickets_sold;
            document.getElementById('movie-tickets').textContent = availableTickets;
            // Disable button if all movie tickets are sold
            document.getElementById('buy-ticket').disabled = availableTickets <= 0;
            // use the conditional statement to evaluate the situation
            if (availableTickets <= 0) {
                alert('Tickets sold out!');
            } else {
                alert('Ticket successfully bought!');}
        })
        .catch(error => console.error('Error updating tickets sold:', error));
    }
    // The getAllMovies and getMovieDetails functions should be called separately
    getAllMovies();
    getMovieDetails();
});