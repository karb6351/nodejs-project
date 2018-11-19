const express = require('express')
const router = express.Router()

const restaurantModel = require('../models/restaurant')

router.get('/', (req, res, next) => {
    let restaurants = []

    const callback = (err, result) => {
        if (err){
            console.log(err.message)
        }else{
            restaurants = result
            console.log(restaurants)
        }
        res.render('pages/restaurant/index', {
            session: req.session,
            restaurants: restaurants
        })
    }

    //callback style
    restaurantModel.getRestaurants(callback)



    

    //promise style
    // restaurantModel
    //     .getRestaurants()
    //     .then(result => {
    //         res.render('pages/restaurant/index', {
    //             session: req.session,
    //             restaurants: result
    //         })
    //     })
    //     .catch(err => {
    //         console.log(err.message)
    //         res.render('pages/restaurant/index', {
    //             session: req.session,
    //             restaurants: []
    //         })
    //     })
})

router.get('/create', (req, res, next) => {
    res.render('pages/restaurant/create')
})

router.post('/create', (req, res, next) => {
    if (!req.body.name || req.body.name === '') {
        res.redirect('/restaurant/create')
    }
    // callback style
    restaurantModel.create(req.body, (err, result) => {
        if (err !== undefined && err) {
            console.log(err)
            res.redirect('back')
        } else {
            console.log(result)
            res.redirect('/restaurant')
        }
    })

    //promise style
    // restaurantModel
    //     .create(req.body)
    //     .then(result => {
    //         console.log(result)
    //         res.redirect('/restaurant')
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.redirect('back')
    //     })
})

router.get('/update/:id', (req, res, next) => {})

router.put('/update/:id', (req, res, next) => {})

router.delete('/delete/:id', (req, res, next) => {})

module.exports = router
