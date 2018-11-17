const mongoService = require('../services/mongodb_service')

const user = {
    collectionName: 'users',
    login: (userid, password) => {
        return mongoService
            .connect()
            .then(client =>
                client
                    .db(`${process.env.MONGODB_DATABASE}`)
                    .collection(user.collectionName)
                    .count({
                        userid: userid,
                        password: password
                    })
            )
            .then( count => {
                if (count <= 0){
                    throw new Error('Invalid userid or password')
                }
                return true
            })
            .catch(err => {
                console.log(err)
                return false
            })
    },
    register: (userid, password) => {
        return mongoService
            .connect()
            .then(client =>
                client
                    .db(`${process.env.MONGODB_DATABASE}`)
                    .collection(user.collectionName)
                    .insertOne({
                        userid: userid,
                        password: password
                    })
            )
            .catch(err => err)
    }
}

module.exports = user
