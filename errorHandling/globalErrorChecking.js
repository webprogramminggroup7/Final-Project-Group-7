const checkInt = (num, numName) => {
    if(typeof num === "string")
        num = parseFloat(num);

    if(typeof num !== "number" || !num ){
        throw {code:400, message: `Invalid input for ${numName}`};
    }
    if(isNaN(num)){
        throw {code:400, message: `Invalid input for ${numName}`};
    }
}

const NotStringOrEmptyString = (str, strName) =>{
    if(typeof str !== "string" || !str ||  str.trim().length < 1){
        throw {code:400, message: `Invalid input for ${strName}`};
    }
}

module.exports = {
    checkInt,
    NotStringOrEmptyString
}