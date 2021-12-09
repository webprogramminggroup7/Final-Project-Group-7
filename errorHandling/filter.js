const nullParam = (param) =>{
    if(param == null){
        return true
    }
}

const NotStringOrEmptyString = (str, strName) =>{
    if(typeof str !== "string" && str.trim().length < 1){
        return true
    }
}

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

const validRatings = (rating) =>{
    if(rating < 1 || rating > 6){
        return true;
    }
}

const checkPrice = (minPrice, maxPrice, obj) =>{
    if(minPrice){
        minPrice = parseFloat(minPrice);
        const isError = checkInt(minPrice);
        if(isError || minPrice < 0 ){
            errorMessage = "Please provide valid price"
            return true;
        }
    }

    if(maxPrice){
        maxPrice = parseFloat(maxPrice);
        const isError = checkInt(maxPrice);
        if(isError || maxPrice < 0){
            errorMessage = "Please provide valid price"
            return true;
        }        
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
    }

    if(maxDuration){
        maxDuration = parseFloat(maxDuration);
        const isError = checkInt(maxDuration);
        if(isError || maxDuration < 1){
            errorMessage = "Please provide valid duration"
            return true;
        }        
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
    }

    if(maxRating){
        maxRating = parseFloat(maxRating);
        const isError = checkInt(maxRating);
        if(isError || maxRating < 0 || maxRating > 5){
            errorMessage = "Please provide valid input for Ratings"
            return true;
        }        
    }

    if(minRating && maxRating){
        if(minRating > maxRating || minRating < 0 || maxRating > 5){
            errorMessage = "Please provide valid input for Ratings"
            return true;
        }
    }
}

module.exports ={
    checkPrice,
    checkDuration,
    checkRatings,
    validRatings,
    NotStringOrEmptyString,
    nullParam
}