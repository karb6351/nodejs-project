const express = require('express')
const router = express.Router()
const restaurantModel = require('../../models/restaurant')

router.get('/', (req, res) => {

})

router.post('/', (req, res) => {
    const body = req.body
    const address = body.address
    const callback = (error, result) => {
        if (error) {
            res.status(404).json({status: "failed"})
        }else {
            res.status(200).json({status: "ok", _id: result.restaurant_id})
        }
    }
    restaurantModel.create({...body, ...address}, req.session.userid, callback)
})


module.exports = router