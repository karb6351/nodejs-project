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
      restaurants: restaurants,
      isSearch: false
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
      req.flash('failure_message', "Name field is required")
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
    console.log(result)
		if (error) {
			console.log(error.message)
			res.redirect('/restaurant')
    } else if (result == []) {
      console.log('Invalid id')
      req.flash('failure_message', 'Invalid id')
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
				if (data) {
					base64 = new Buffer(data).toString('base64')
				}
				restaurantModel.getRestaurantbyId(req.params.id, (err, oldRestaurant) => {
					if (err !== undefined && err) {
						res.redirect('back')
          } else if (oldRestaurant == []) {
            console.log('Invalid id')
						req.flash('failure_message', 'Invald id')
            res.redirect('back')
          } else if (oldRestaurant[0].owner != req.session.userid) {
						console.log('Unauthorized')
						req.flash('failure_message', 'Unauthorized access')
						res.status(403).redirect('back')
					} else {
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
				})
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

router.get('/delete/:id', (req, res, next) => {
	const callback = (error, result) => {
		if (error) {
			console.log(error)
		} else {
      if (result == []){
        console.log('Invalid id')
				req.flash('failure_message', 'Invalid id')
				res.redirect('back')
      } else if (req.session.userid != result[0].owner) {
				console.log('Unauthorized')
				req.flash('failure_message', 'Unauthorized')
				res.redirect('/restaurant')
			} else {
				const callback2 = (err, result) => {
					if (err) {
						req.flash('failure_message', 'You have failure to delete this restaurant')
						res.redirect('/restaurant')
					} else {
						req.flash('success_message', 'You have deleted this restaurant')
						res.redirect('/restaurant')
					}
				}
				restaurantModel.delete(req.session.userid, result[0]._id, callback2)
			}
		}
	}
	restaurantModel.getRestaurantbyId(req.params.id, callback)
})

const checkRated = (grades, userid) => {
	if (!grades) return false
	for (i = 0; i < grades.length; i++) {
		if (grades[i].user_id == userid) {
			return true
		}
	}
	return false
}

router.get('/rate/:id', (req, res, next) => {
	const callback = (error, result) => {
		if (error) {
			console.log('cant get restaurant')
		} else {
      if (result == []) {
        console.log('Invalid id')
				req.flash('failure_message', 'Invalid id')
				res.redirect('back')
      } else if (checkRated(result[0].grades, req.session.userid)) {
				console.log('Rated')
				req.flash('failure_message', 'You have rated before.')
				res.redirect('/restaurant')
			} else if (req.body.score < 0 || req.body.score > 10) {
        console.log('invalid score')
				req.flash('failure_message', 'The score should between 0 to 10')
				res.redirect('/restaurant')
      } else {
				res.render('pages/restaurant/rate', {
					restaurant: result[0]
				})
			}
		}
	}
	restaurantModel.getRestaurantbyId(req.params.id, callback)

})

router.post('/rate/:id', (req, res, next) => {
	const callback = (error, result) => {
		if (error) {
			console.log('Cant get restautant')
			res.redirect('/restaurant')
		} else if (req.body.rate < 0 || req.body.rate > 10){
      console.log('Invalid score input', req.body.rate)
      req.flash('failure_message', 'Score must be in range 0 to 10')
			res.redirect('/restaurant')
    } else if (result == []) {
      console.log('Can\'t get restautant')
      req.flash('failure_message', 'Invalid restaurant id')
			res.redirect('/restaurant')
    }else {
			if (checkRated(result[0].grades, req.session.userid)) {
				req.flash('failure_message', 'You have rated before.')
				res.redirect('/restaurant')
			} else {
				const callback2 = (error, result) => {
					if (error) {
						console.log('Error, cant rate')
						req.flash('failure_message', 'Error, cant rate.')
						res.redirect('/restaurant')
					} else {
						console.log('You have succeefully rated')
						req.flash('success_message', 'You have succeefully rated')
						res.redirect('/restaurant')
					}
				}
				restaurantModel.rate(req.session.userid, req.body.rate, req.body._id, callback2)
			}
		}
	}
	restaurantModel.getRestaurantbyId(req.params.id, callback)
})


router.post('/search', (req, res, next) => {
	const callback = (error, result) => {
		if (error) {
			console.log('Search error')
			req.flash('failure_message', 'Error, cant search')
			res.redirect('/restaurant')
		} else {
			console.log('Successfully search result')
			res.render('pages/restaurant/index', {
				session: req.session,
        restaurants: result,
        isSearch: true,
			})
		}
  }
  if (!req.body.search || req.body.search == '') {
    console.log('search key', req.body.search)
    req.flash('failure_message', 'Search key is required')
    res.redirect('back')
  } else {
    //call model getRestaurantsWithSearchKey
    restaurantModel.search(req.body.search, callback)
  }
})

router.get('/:id', (req, res, next) => {
	restaurantModel.getRestaurantbyId(req.params.id, (error, result) => {
		if (error) {
      console.log(error.message)
      req.flash('failure_message', 'Internal Server error')
      res.redirect('back')
		} else {
      res.render('pages/restaurant/view', {
        restaurant: result[0]
      })
		}
	})
})

module.exports = router
