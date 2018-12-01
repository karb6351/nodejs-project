const mongoService = require('../services/mongodb_service')
const ObjectID = require('mongodb').ObjectID

//test
const restaurant = {
	collectionName: 'restaurants',
	getRestaurants: (cb) => {
		if (cb !== undefined && cb) {
			const callback = (error, client) => {
				if (error !== undefined && error) {
					cb(error, null)
				} else {
					client
						.db(`${process.env.MONGODB_DATABASE}`)
						.collection(restaurant.collectionName)
						.find()
						.toArray(cb)
				}
			}
			// callback style
			mongoService.connect(callback)
		} else {
			// promise style
			return mongoService.connect().then((client) => {
				return client
					.db(`${process.env.MONGODB_DATABASE}`)
					.collection(restaurant.collectionName)
					.find()
					.toArray()
			})
		}
	},

	getRestaurantbyId: (id, cb) => {
		const callback = (error, result) => {
			if (error) {
				cb(error, null)
			} else {
				result
					.db(`${process.env.MONGODB_DATABASE}`)
					.collection(restaurant.collectionName)
					.find({ _id: ObjectID(id) })
					.toArray(cb)
			}
		}
		mongoService.connect(callback)
	},

	update: (
		{
      // restaurant_id,
      _id,
			name,
			borough,
			cuisine,
			street,
			building,
			zipcode,
      lat,
      lon,
			photo,
			extension
		},
		old_restaurant_id,
		old_restaurant,
		cb
	) => {
		// const callback =
		mongoService.connect((error, result) => {
			if (error !== undefined && error) {
				cb(error, null)
			} else {
				update_extension = extension == '' ? old_restaurant.extension : extension
				update_photo = photo == '' ? old_restaurant.photo : photo
				result.db(`${process.env.MONGODB_DATABASE}`).collection(restaurant.collectionName).update(
					{
						_id: ObjectID(_id)
					},
					{
						$set: {
							// restaurant_id: restaurant_id,
							name: name,
							borough: borough,
							cuisine: cuisine,
							address: {
								street: street,
								building: building,
								zipcode: zipcode,
								lat: lat,
                lon: lon
							},
							photo: update_photo,
							extension: update_extension
						}
					},
					cb
				)
			}
		})
	},
	create: (
		{
			// restaurant_id,
			name,
			borough,
			cuisine,
			street,
			building,
			zipcode,
      lat,
      lon,
			photo,
			extension
		},
		userID,
		cb
	) => {
		if (cb !== undefined && cb) {
			// callback style
			mongoService.connect((error, client) => {
				if (error !== undefined && error) {
					cb(err)
				} else {
					client.db(`${process.env.MONGODB_DATABASE}`).collection(restaurant.collectionName).insertOne(
						{
							// restaurant_id: restaurant_id,
							name: name,
							borough: borough,
							cuisine: cuisine,
							address: {
								street: street,
								building: building,
								zipcode: zipcode,
                lat: lat,
                lon: lon
							},
							grades: [],
							photo: photo,
							extension: extension,
							owner: userID
						},
						cb
					)
				}
			})
		} else {
			//promise style
			return mongoService.connect().then((client) =>
				client.db(`${process.env.MONGODB_DATABASE}`).collection(restaurant.collectionName).insertOne({
					restaurant_id: restaurant_id,
					name: name
				})
			)
		}
	},

	rate: (user_id, score, _id, cb) => {
		const callback = (error, client) => {
			if (error) {
				cb(error)
			} else {
				client.db(`${process.env.MONGODB_DATABASE}`).collection(restaurant.collectionName).update(
					{
						_id: ObjectID(_id)
					},
					{
						$push: { grades: { user_id, score } }
					},
					cb
				)
			}
		}
		mongoService.connect(callback)
	},

	search: (key, cb) => {
		const callback = (error, client) => {
			if (error) {
				cb(error)
			} else {
				client
					.db(`${process.env.MONGODB_DATABASE}`)
					.collection(restaurant.collectionName)
					.find({
						$or: [ { name: key }, { borough: key }, { cuisine: key } ]
					})
					.toArray(cb)
			}
		}
		mongoService.connect(callback)
	},

	search2: (search_key, search_value, cb) => {
		const callback = (error, client) => {
			if (error) {
				cb(error)
			} else {
				let container = {}
				container[search_key] = search_value
				client
					.db(`${process.env.MONGODB_DATABASE}`)
					.collection(restaurant.collectionName)
					.find(container)
					.toArray(cb)
			}
		}
		mongoService.connect(callback)
	},

	delete: (user_id, _id, cb) => {
		const callback = (error, client) => {
			if (error !== undefined && error) {
				cb(err)
			} else {
				client.db(`${process.env.MONGODB_DATABASE}`).collection(restaurant.collectionName).deleteOne(
					{
						owner: user_id,
						_id: ObjectID(_id)
					},
					cb
				)
			}
		}
		mongoService.connect(callback)
	}
}

module.exports = restaurant
