const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')

const restaurantModel = require('../models/restaurant')

router.get('/', (req, res, next) => {
    let restaurants = []

    const callback = (err, result) => {
        if (err) {
            console.log(err.message)
        } else {
            restaurants = result
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
    const form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        const filename = files.photo.path
        const extension = files.photo.type
        if (!fields['name'] || fields['name'] === '') {
            res.redirect('back')
        } else {
            fs.readFile(filename, (err, data) => {
                const base64 = new Buffer(data).toString('base64')
                // callback style
                restaurantModel.create(
                    { ...fields, photo: base64, extension: extension },
                    req.session.userid,
                    (err, result) => {
                        if (err !== undefined && err) {
                            console.log(err)
                            req.flash('failure_message', 'You have failure create the restaurant')
                            res.redirect('back')
                        } else {
                            req.flash('success_message', 'You have successfully create the restaurant')
                            res.redirect('/restaurant')
                        }
                    }
                )
            })
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
    const callback = (error, result) => {
        if (error) {
            console.log(error.message)
            res.redirect('/restaurant')
        } else if (result[0].owner !== req.session.userid) {
            console.log('Unauthorized')
            req.flash('failure_message', 'Unauthorized access')
            res.status(403).redirect('back')
        } else {
            restaurant = result[0]
            res.render('pages/restaurant/update', {
                restaurant: restaurant
            })
        }
    }
    restaurantModel.getRestaurantbyId(req.params.id, callback)
})

router.post('/update/:id', (req, res, next) => {
    const form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        const filename = files.photo.path
        const extension = files.photo.type
        if (!fields['name'] || fields['name'] === '') {
            res.redirect('back')
        } else {
            fs.readFile(filename, (err, data) => {
                let base64 = ''
                if (data){
                    base64 = new Buffer(data).toString('base64')
                }
                restaurantModel.getRestaurantbyId(
                    req.params.id,
                    (err, oldRestaurant) => {
                        if (err !== undefined && err) {
                            res.redirect('back')
                        } else if (oldRestaurant.owner != req.session.userid) {
                            console.log('Unauthorized')
                            req.flash('failure_message', 'Unauthorized access')
                            res.status(403).redirect('back')
                        } else{
                            restaurantModel.update(
                                {
                                    ...fields,
                                    photo: base64,
                                    extension: extension
                                },
                                req.params.id,
                                oldRestaurant[0],
                                (error, result) => {
                                    if (error) {
                                        console.log(error.message)
                                        req.flash('failure_message', 'You have failure update the restaurant')
                                        res.redirect('/restaurant')
                                    } else {
                                        req.flash('success_message', 'You have successfully update the restaurant')
                                        res.redirect('/restaurant')
                                    }
                                }
                            )
                        }
                    }
                )
            })
        }
    })

    // const callback = (error, result) => {
    //     if (error) {
    //         console.log(error.message)
    //         res.redirect('/restaurant')
    //     } else {
    //         res.redirect('/restaurant')
    //     }
    // }
    // restaurantModel.update(req.body, req.params.id, callback)
})

router.get ('/delete/:id', (req, res, next) => {
    const callback = (error, result)=>{
        if (error){
            console.log(error);
        }
        else{
            if(req.session.userid != result[0].owner ){
                console.log(req.session.userid)
                console.log(result[0].owner)
                console.log('Unauthorized')
                req.flash('failure_message', 'ON9, debug la')
                res.redirect('/restaurant')
                        
            }
            else{
                const callback2 = (err, result) => {
                    if (err){
                        req.flash('failure_message', 'You have failure to delete this restaurant')
                        res.redirect('/restaurant')
                    }
                    else{
                        req.flash('success_message', 'You have deleted this restaurant')
                        res.redirect('/restaurant')
                    }
                }
                restaurantModel.delete(req.session.userid, result.restaurant_id, callback2)
            }
        }
    }

    console.log(req.params.id)

    restaurantModel.getRestaurantbyId(req.params.id , callback);


})

module.exports = router
