const express = require('express')
const router = express.Router()

const restaurantModel = require('../models/restaurant')

router.get('/', (req, res, next) => {
    // const restaurants = restaurantModel.getRestaurants()
    //dummy data
    const restaurants = [
        {
            restaurant_id: 'Eclair',
            name: 'Alvin',
            borough: 'Alvin',
            cuisine: 'Alvin',
            photo: 'Alvin',
            address: 'Alvin'
        },
        {
            restaurant_id: 'Eclair',
            name: 'Alvin',
            borough: 'Alvin',
            cuisine: 'Alvin',
            photo: 'Alvin',
            address: 'Alvin'
        },
        {
            restaurant_id: 'Eclair',
            name: 'Alvin',
            borough: 'Alvin',
            cuisine: 'Alvin',
            photo: 'Alvin',
            address: 'Alvin'
        },
        {
            restaurant_id: 'Eclair',
            name: 'Alvin',
            borough: 'Alvin',
            cuisine: 'Alvin',
            photo: 'Alvin',
            address: 'Alvin'
        },
        {
            restaurant_id: 'Eclair',
            name: 'Alvin',
            borough: 'Alvin',
            cuisine: 'Alvin',
            photo: 'Alvin',
            address: 'Alvin'
        },
        {
            restaurant_id: 'Eclair',
            name: 'Alvin',
            borough: 'Alvin',
            cuisine: 'Alvin',
            photo: 'Alvin',
            address: 'Alvin'
        },
        {
            restaurant_id: 'Eclair',
            name: 'Alvin',
            borough: 'Alvin',
            cuisine: 'Alvin',
            photo: 'Alvin',
            address: 'Alvin'
        }
    ]
    res.render('pages/restaurant/index', {
        session: req.session,
        restaurants: restaurants
    })
})

router.get('/create', (req, res, next) => {
    res.render('pages/restaurant/create')
})

router.post('/create', (req, res, next) => {
    const restaurant_id = req.body.restaurant_id
    const name = req.body.name
    restaurantModel.create(restaurant_id, name, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log(result) 
        }
    })

    //promise style
    // restaurantModel
    //     .create(restaurant_id, name)
    //     .then(result => {})
    //     .catch(err => {
    //         console.error(err)
    //     })
})

router.get('/update/:id', (req, res, next) => {})

router.put('/update/:id', (req, res, next) => {})

router.delete('/delete/:id', (req, res, next) => {})

module.exports = router
