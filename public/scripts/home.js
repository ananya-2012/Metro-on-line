let next = document.querySelector('.next')
let prev = document.querySelector('.prev')

next.addEventListener('click', function(){
    let items = document.querySelectorAll('.item')
    document.querySelector('.slide').appendChild(items[0])
})

prev.addEventListener('click', function(){
    let items = document.querySelectorAll('.item')
    document.querySelector('.slide').prepend(items[items.length - 1])
})

document.querySelectorAll('.see-more').forEach(button => {
    button.addEventListener('click', function() {
        const city = this.getAttribute('data-city');
        localStorage.setItem('city', city); // Store city name
        window.location.href = '/login'; // Redirect to login page
    });
});
