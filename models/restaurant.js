const mongoService = require("../services/mongodb_service");

//test
const restaurant = {
  collectionName: "restaurants",
  getRestaurants: cb => {
    if (cb !== undefined && cb) {
      const callback = (error, client) => {
        if (error !== undefined && error) {
          cb(error, null);
        } else {
          client
            .db(`${process.env.MONGODB_DATABASE}`)
            .collection(restaurant.collectionName)
            .find()
            .toArray(cb);
        }
      };
      // callback style
      mongoService.connect(callback);
    } else {
      // promise style
      return mongoService.connect().then(client => {
        return client
          .db(`${process.env.MONGODB_DATABASE}`)
          .collection(restaurant.collectionName)
          .find()
          .toArray();
      });
    }
  },

  getRestaurantbyId: (id, cb) => {
    const callback = (error, result) => {
      if (error) {
        cb(error, null);
      } else {
        result
          .db(`${process.env.MONGODB_DATABASE}`)
          .collection(restaurant.collectionName)
          .find({
            restaurant_id: id
          })
          .toArray(cb);
      }
    };
    mongoService.connect(callback);
  },

  update: (
    { restaurant_id, name, borough, cuisine, street, building, zipcode, coord },
    userID,
    cb
  ) => {
    // const callback =
    mongoService.connect((error, result) => {
      if (error !== undefined && error) {
        cb(error, null);
      } else {
        result
          .db(`${process.env.MONGODB_DATABASE}`)
          .collection(restaurant.collectionName)
          .update(
            {
              restaurant_id: userID
            },
            {
              restaurant_id: restaurant_id,
              name: name,
              borough: borough,
              cuisine: cuisine,
              address: {
                street: street,
                building: building,
                zipcode: zipcode,
                coord: coord
              }
            },
            cb
          );
      }
    });
  },
  create: (
    { restaurant_id, name, borough, cuisine, street, building, zipcode, coord },
    userID,
    cb
  ) => {
    if (cb !== undefined && cb) {
      // callback style
      mongoService.connect((error, client) => {
        if (error !== undefined && error) {
          cb(err);
        } else {
          client
            .db(`${process.env.MONGODB_DATABASE}`)
            .collection(restaurant.collectionName)
            .insertOne(
              {
                restaurant_id: restaurant_id,
                name: name,
                borough: borough,
                cuisine: cuisine,
                address: {
                  street: street,
                  building: building,
                  zipcode: zipcode,
                  coord: coord
                },
                grades: [],
                owner: userID
              },
              cb
            );
        }
      });
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
      );
    }
  }
};

module.exports = restaurant;
