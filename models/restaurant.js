const mongoService = require('../services/mongodb_service')

const restaurant = {
    collectionName: 'restaurants',
    getRestaurants: () => {
        const restaurants = mongoService
            .connect()
            .then(client => {
                const collection = mongoService.getCollection(
                    client,
                    this.collectionName
                )
                return collection.find().toArray()
            })
            .catch(err => {
                console.error(err)
                return []
            })
        console.log('Get restaurants' + restaurants)
        return restaurants
    },
    create: (restaurant_id, name, cb) => {
        if (cb !== undefined && cb) {
            // callback style
            mongoService.connect((err, client) => {
                if (err) {
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
