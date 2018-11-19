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
    restaurantModel.create(req.body, req.session.userid, (err, result) => {
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

router.get('/update/:id', (req, res, next) => {
    const callback = (error, result) =>{
        if(error){
            console.log(error.message)
            res.redirect("/restaurant")
        }
        else{
            restaurant = result[0];
            res.render("pages/restaurant/update",{
                restaurant: restaurant
            });
        }
    }    
    restaurantModel.getRestaurantbyId(req.params.id, callback)
})

router.post('/update/:id', (req, res, next) => {
    console.log('asd')
    const callback = (error, result) =>{
        if(error){
            console.log(error.message)
            res.redirect("/restaurant")
        }
        else{
            res.redirect("/restaurant")
        }
    }

    restaurantModel.update(req.body, req.params.id, callback)

})

router.get('/delete/:id', (req, res, next) => {})

module.exports = router
