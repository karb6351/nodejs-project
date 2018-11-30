const express = require('express')
const router = express.Router()
const restaurantModel = require('../../models/restaurant')

router.get('/:key/:value', (req, res) => {
    const callback = (error, result) => {
        console.log(result)
        if (error) {
            res.status(404).json({})
        }else {
            res.status(200).json(result)
        }
    }
    restaurantModel.search2(req.params.key, req.params.value, callback)
})

router.post('/', (req, res) => {
    const body = req.body
    const address = body.address
    const callback = (error, result) => {
        console.log(result)
        if (error) {
            res.status(404).json({status: "failed"})
        }else {
            res.status(200).json({status: "ok", _id: result.insertedId})
        }
    }
    restaurantModel.create({...body, ...address}, req.session.userid, callback)
})


module.exports = router