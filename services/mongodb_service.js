require('dotenv').config()
const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient

const connect = cb => {
    if (cb === undefined || !cb) {
        // using promise style
        return mongoClient.connect(
            `mongodb://${process.env.MONGODB_DB_USERNAME}:${
                process.env.MONGODB_DB_PASSWORD
            }@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${
                process.env.MONGODB_DATABASE
            }`,
            { useNewUrlParser: true }
        )
    } else {
        // using callback style
        mongoClient.connect(
            `mongodb://${process.env.MONGODB_DB_USERNAME}:${
                process.env.MONGODB_DB_PASSWORD
            }@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${
                process.env.MONGODB_DATABASE
            }`,
            { useNewUrlParser: true },
            cb
        )
    }
}

const getCollection = (client, collectionName) =>
    client.db(process.env.MONGODB_DATABASE).collection(collectionName)

module.exports = {
    connect,
    getCollection
}
