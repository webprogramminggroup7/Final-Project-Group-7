const checkInt=(num) => {
    if(typeof num === "string")
        num = parseFloat(num);

    if(typeof num !== "number"){
        return true
    }
    if(isNaN(num)){
        return true
    }
}

(function($) {
    let errorMessage = null;

    const checkPrice = (minPrice, maxPrice, obj) =>{
        if(minPrice){
            minPrice = parseFloat(minPrice);
            const isError = checkInt(minPrice);
            if(isError || minPrice < 0 ){
                errorMessage = "Please provide valid price"
                return true;
            }
            obj.minPrice = minPrice
        }

        if(maxPrice){
            maxPrice = parseFloat(maxPrice);
            const isError = checkInt(maxPrice);
            if(isError || maxPrice < 0){
                errorMessage = "Please provide valid price"
                return true;
            }
            obj.maxPrice = maxPrice
            
        }

        if(minPrice && maxPrice){
            if(minPrice > maxPrice){
                errorMessage = "Min field should be less than max field"
                return true;
            }
        }
    }

    const checkDuration = (minDuration, maxDuration, obj) =>{
        if(minDuration){
            minDuration = parseFloat(minDuration);
            const isError = checkInt(minDuration);
            if(isError || minDuration < 1){
                errorMessage = "Please provide valid duration"
                return true;
            }
            obj.minDuration = minDuration
        }

        if(maxDuration){
            maxDuration = parseFloat(maxDuration);
            const isError = checkInt(maxDuration);
            if(isError || maxDuration < 1){
                errorMessage = "Please provide valid duration"
                return true;
            }
            obj.maxDuration = maxDuration
            
        }

        if(minDuration && maxDuration){
            if(minDuration > maxDuration){
                errorMessage = "Min field should be less than max field"
                return true;
            }
        }
    }

    const checkRatings = (minRating, maxRating, obj) =>{
        if(minRating){
            minRating = parseFloat(minRating);
            const isError = checkInt(minRating);
            if(isError || minRating < 0 || minRating > 5){
                errorMessage = "Please provide valid input for Ratings"
                return true;
            }
            obj.minRating = minRating
        }

        if(maxRating){
            maxRating = parseFloat(maxRating);
            const isError = checkInt(maxRating);
            if(isError || maxRating < 0 || maxRating > 5){
                errorMessage = "Please provide valid input for Ratings"
                return true;
            }
            obj.maxRating = maxRating
            
        }

        if(minRating && maxRating){
            if(minRating > maxRating || minRating < 0 || maxRating > 5){
                errorMessage = "Please provide valid input for Ratings"
                return true;
            }
        }
    }
    //filter client side
    let filterForm = $('#filter-form');
    let minPriceInput = $('#min-price'),
        maxPriceInput = $('#max-price'),
        minRatingsInput = $('#min-ratings'),
        maxRatingsInput = $('#max-ratings'),
        minDurationInput = $('#min-duration'),
        maxDurationInput = $('#max-duration');
    let tourPageDiv = $('#tour-page');
    let errorP = $('#filter-error');
    
    filterForm.submit(function(event){
        event.preventDefault();

        var minPrice = minPriceInput.val();
        var maxPrice = maxPriceInput.val();
        var minRating = minRatingsInput.val();
        var maxRating = maxRatingsInput.val();
        var minDuration = minDurationInput.val();
        var maxDuration = maxDurationInput.val();

        var obj = {}
        errorP.hide();

        const priceError = checkPrice(minPrice, maxPrice, obj);
        if(priceError){
            errorP.text(errorMessage);
            errorP.show();
            return
        }

        const ratingsError = checkRatings(minRating, maxRating, obj);
        if(ratingsError){
            errorP.text(errorMessage);
            errorP.show();
            return;
        }

        const durationError = checkDuration(minDuration, maxDuration, obj);
        if(durationError){
            errorP.text(errorMessage);
            errorP.show();
            return;
        }

        

        errorP.hide();
        var requestConfig = {
            method: 'POST',
            url:`/filter`,
            contentType: 'application/json',
            data: JSON.stringify(obj)
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
            if(searchValue.trim() < 1){
                alert("Please provide a valid search input");
                return;
            }

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