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
        },
    ]
    res.render('pages/restaurant/index', { session: req.session, restaurants: restaurants })
})

router.get('/create', (req, res, next) => {
})

router.post('/create', (req, res, next) => {
})

router.get('/update/:id', (req, res, next) => {
})

router.put('/update/:id', (req, res, next) => {
})

router.delete('/delete/:id', (req, res, next) => {
})

module.exports = router