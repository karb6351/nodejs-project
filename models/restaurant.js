const mongoService = require('../services/mongodb_service')

const restaurant = {
    collectionName: 'restaurants',
    getRestaurants: () => {
        const restaurants = mongoService
            .connect()
            .then(client => {
                const collection = mongoService.getCollection(client, this.collectionName)
                return collection.find().toArray()
            })
            .catch(err => {
                console.error(err)
                return []
            })
        console.log('Get restaurants' + restaurants)
        return restaurants
    }
}

module.exports = restaurant
