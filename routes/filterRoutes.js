const express = require('express');
const router = express.Router();
const axios = require('axios');
const filterChecking = require('../errorHandling/filter');

router.post('/', async(req, res)=>{
    try{
        const {minPrice, maxPrice, minRating, maxRating, minDuration, maxDuration} = req.body;
        const priceError = filterChecking.checkPrice(minPrice, maxPrice);
        if(priceError){
            res.status(404).json({
                message: priceError
            })
            return;
        }
        const ratingsError = filterChecking.checkRatings(minRating, maxRating);
        if(ratingsError){
            res.status(404).json({
                message: ratingsError
            })
            return;
        }
        const durationError = filterChecking.checkDuration(minDuration, maxDuration);
        if(durationError){
            res.status(404).json({
                message: durationError
            })
            return;
        }
         
        let baseUrl = "http://localhost:3000/travel-bliss/tours";
        if(minPrice || maxPrice || minRating || maxRating || minDuration || maxDuration){
            baseUrl += '?';
        }
        if(maxDuration) baseUrl += "duration[lte]="+ maxDuration + "&";
        if(minDuration) baseUrl += "duration[gte]="+ minDuration + "&";
        if(minRating) baseUrl += "ratingsAverage[gte]="+ minRating + "&";
        if(maxRating) baseUrl += "ratingsAverage[lte]="+ maxRating + "&";
        if(maxPrice) baseUrl += "price[lte]="+ maxPrice + "&";
        if(minPrice) baseUrl += "price[gte]="+ minPrice ;

        if(baseUrl.endsWith('&')){
            baseUrl = baseUrl.substring(0, baseUrl.length-1);
        }

        //const url = `http://localhost:3000/travel-bliss/tours?duration[lte]=${maxDuration}&duration[gte]=${minDuration}&ratingsAverage[gte]=${minRating}&ratingsAverage[lte]=${maxRating}&price[lte]=${maxPrice}&price[gte]=${minPrice}`;
        const data = await axios({
            method: 'GET',
            url: baseUrl
        });
        const tours = data.data.data;
        res.status(200).render('toursList', {tours: tours});

    }catch(ex){
        res.status(500).json({
            message: ex
        });
    }
})

router.post('/search', async(req, res)=>{
    try{
        const {searchValue} = req.body;
        if(searchValue.trim() < 1){
            res.status(400).json({
                message: 'Please provide valid search input'
            })
            return;
        }
        const url = `http://localhost:3000/travel-bliss/tours`
        const data = await axios({
            method: 'GET',
            url: url
        });
        const allTours = data.data.data;
        const searchResult = [];
        if(allTours.length>0){
            allTours.forEach((tour)=>{
                if(tour.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1){
                    searchResult.push(tour);
                }
            })
        }
        res.status(200).render('toursList', {tours: searchResult});
    }catch(ex){
        res.status(500).json({
            message: ex
        });
    }
})

router.post('/sort', async(req,res)=>{
    try{
        const {sortBy} = req.body;
        if(typeof sortBy !== "string"){
            res.status(400).json({
                message: 'SortBy value is incorrect'
            })
        }
        const url = `http://localhost:3000/travel-bliss/tours?sort=${sortBy}`;
        const data = await axios({
            method: 'GET',
            url: url
        });
        const tours = data.data.data;
        res.status(200).render('toursList', {tours: tours});
    }catch(ex){
        res.status(500).json({
            message: ex
        });
    }
})

router.post('/most-popular-ones', async(req,res)=>{
    try{
        const url = `http://localhost:3000/travel-bliss/tours/top-5-mostpopular-tours`;
        const data = await axios({
            method: 'GET',
            url: url
        });
        const tours = data.data.data;
        res.status(200).render('toursList', {tours: tours});
    }catch(ex){
        res.status(500).json({
            message: ex
        });
    }
})

module.exports = router