const mongoService = require('../services/mongodb_service')

const restaurant = {
    collectionName: 'restaurants',
    getRestaurants: cb => {
        if (cb !== undefined && cb) {
            // callback style
            mongoService.connect((error, client) => {
                if (error !== undefined && error) {
                    cb(error)
                } else {
                    client
                        .db(`${process.env.MONGODB_DATABASE}`)
                        .collection(restaurant.collectionName)
                        .find()
                        .toArray(cb)
                }
            })
        } else {
            // promise style
            return mongoService.connect().then(client => {
                return client
                    .db(`${process.env.MONGODB_DATABASE}`)
                    .collection(restaurant.collectionName)
                    .find()
                    .toArray()
            })
        }
    },
    create: ({ restaurant_id, name }, cb) => {
        if (cb !== undefined && cb) {
            // callback style
            mongoService.connect((error, client) => {
                if (error !== undefined && error) {
                    cb(err)
                } else {
                    client
                        .db(`${process.env.MONGODB_DATABASE}`)
                        .collection(restaurant.collectionName)
                        .insertOne(
                            {
                                restaurant_id: restaurant_id,
                                name: name
                            },
                            cb
                        )
                }
            })
        } else {
            //promise style
            return mongoService.connect().then(client =>
                client
                    .db(`${process.env.MONGODB_DATABASE}`)
                    .collection(restaurant.collectionName)
                    .insertOne({
                        restaurant_id: restaurant_id,
                        name: name
                    })
            )
        }
    }
}

module.exports = restaurant
