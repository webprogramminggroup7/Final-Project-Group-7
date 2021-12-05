const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async(req, res)=>{
    try{
        const {minPrice, maxPrice, minRating, maxRating, minDuration, maxDuration} = req.body;
        const url = `http://localhost:3000/travel-bliss/tours?duration[lte]=${maxDuration}&duration[gte]=${minDuration}&ratingsAverage[gte]=${minRating}&ratingsAverage[lte]=${maxRating}&price[lte]=${maxPrice}&price[gte]=${minPrice}`;
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