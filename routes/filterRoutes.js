const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async(req, res)=>{
    try{
        const {minPrice, maxPrice, minRating, maxRating, minDuration, maxDuration} = req.body;
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
        const data = await axios({
            method: 'GET',
            url: baseUrl
        });
        const tours = data.data.data;
        console.log(tours);
        res.status(200).render('toursList', {tours: tours});
    }catch(ex){
        console.log(ex);
    }
})

router.post('/search', async(req, res)=>{
    try{
        const {searchValue} = req.body;
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
        res.render('toursList', {tours: searchResult});
    }catch(ex){
        console.log(ex);
    }
})

router.post('/sort', async(req,res)=>{
    try{
        const {sortBy} = req.body;
        const url = `http://localhost:3000/travel-bliss/tours?sort=${sortBy}`;
        const data = await axios({
            method: 'GET',
            url: url
        });
        const tours = data.data.data;
        res.render('toursList', {tours: tours});
    }catch(ex){
        console.log(ex);
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
        res.render('toursList', {tours: tours});
    }catch(ex){
        console.log(ex);
    }
})

module.exports = router