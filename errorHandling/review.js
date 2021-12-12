const checkInt = (num, numName) => {
    if(typeof num === "string")
        num = parseFloat(num);

    if(typeof num !== "number" || !num ){
        throw {statusCode:400, message: `Invalid input for ${numName}`};
    }
    if(isNaN(num)){
        throw {statusCode:400, message: `Invalid input for ${numName}`};
    }
}

const NotStringOrEmptyString = (str, strName) =>{
    if(typeof str !== "string" || !str ||  str.trim().length < 1){
        throw {statusCode:400, message: `Invalid input for ${strName}`};
    }
}

const checkRating = (rating) =>{
    if(rating < 1 || rating > 5){
        throw {statusCode:400, message: `Rating should be in between 1-5`};
    }
}

module.exports = {
    checkInt,
    NotStringOrEmptyString,
    checkRating
}