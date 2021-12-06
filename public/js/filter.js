(function($) {

    //filter client side
    let filterForm = $('#filter-form');
    let minPriceInput = $('#min-price'),
        maxPriceInput = $('#max-price'),
        minRatingsInput = $('#min-ratings'),
        maxRatingsInput = $('#max-ratings'),
        minDurationInput = $('#min-duration'),
        maxDurationInput = $('#max-duration');
    let tourPageDiv = $('#tour-page');
    
    
    filterForm.submit(function(event){
        event.preventDefault();

        var minPrice = minPriceInput.val();
        var maxPrice = maxPriceInput.val();
        var minRating = minRatingsInput.val();
        var maxRating = maxRatingsInput.val();
        var minDuration = minDurationInput.val();
        var maxDuration = maxDurationInput.val();

        var requestConfig = {
            method: 'POST',
            url:`/filter`,
            contentType: 'application/json',
            data: JSON.stringify({
                minPrice : minPrice,
                maxPrice: maxPrice,
                minRating, minRating,
                maxRating: maxRating,
                minDuration: minDuration,
                maxDuration: maxDuration
            })
        }; 

        $.ajax(requestConfig).then(function(responseMessage){
            var newElement = $(responseMessage);
            tourPageDiv.html(newElement);
        })
        
    })

    //search client side
    let searchInput = $('#search-input');
    searchInput.keypress(function(event){

        if (event.keyCode === 13) {
            event.preventDefault();
            var searchValue = searchInput.val();

            var requestConfig = {
                method: 'POST',
                url: '/filter/search',
                contentType: 'application/json',
                data: JSON.stringify({
                    searchValue: searchValue
                })
            }

            $.ajax(requestConfig).then(function(responseMessage){
                var newElement = $(responseMessage);
                tourPageDiv.html(newElement);
            })
        }
    })

    //Sort By implementation
    let highPriceSortBtn = $('#high-price'),
        lowPriceSortBtn = $('#low-price'),
        highRatingSortBtn = $('#high-rating'),
        lowRatingSortBtn = $('#low-rating');
    
    function CallAPI(str){
        let requestConfig ={
            method : 'POST',
            url: 'filter/sort',
            contentType: 'application/json',
            data: JSON.stringify({
                    sortBy: str
            })
        }
        $.ajax(requestConfig).then(function(responseMessage){
            var newElement = $(responseMessage);
            tourPageDiv.html(newElement);
        })
    }

    //sort by price - high to low
    highPriceSortBtn.click(function(event){
        event.preventDefault();
        CallAPI('-price');
    })

    //sort by price - low to high
    lowPriceSortBtn.click(function(event){
        event.preventDefault();
        CallAPI('price');
    })
    
    //sort by ratings - high to low
    highRatingSortBtn.click(function(event){
        event.preventDefault();
        CallAPI('-ratingsAverage');
    })

    //sort by ratings - low to high
    lowRatingSortBtn.click(function(event){
        event.preventDefault();
        CallAPI('ratingsAverage');
    })


    //Most-Popular Ones
    let mostPopularBtn = $('#most-popular');
    mostPopularBtn.click(function(event){
        event.preventDefault();
        let requestConfig ={
            method : 'POST',
            url: 'filter/most-popular-ones',
            contentType: 'application/json'
        }
        $.ajax(requestConfig).then(function(responseMessage){
            var newElement = $(responseMessage);
            tourPageDiv.html(newElement);
        })
    })

})(window.jQuery); 