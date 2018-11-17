const express = require('express')
const router = express.Router()

const user = require('../models/user')

const auth = require('../middlewares/auth')
const guest = require('../middlewares/guest')

router.get('/login', guest, (req, res) => {
    res.render('pages/user/login', {
        session: req.session
    })
})

router.post('/login', guest, (req, res) => {
    user.login(req.body.userid, req.body.password)
        .then(successToLogin => {
            if (!successToLogin){
                console.log('Login failure')
                req.flash('failure_message', 'Invalid user id or password')
                res.redirect('back')
            }else{
                req.session.userid = req.body.userid
                console.log('Login success')
                req.flash('success_message', 'Login Success')
                res.redirect('/restaurant')
            }
        })
})

router.get('/register', guest, (req, res) => {
    res.render('pages/user/register')
})

router.post('/register', guest, (req, res) => {
    user.register(req.body.userid, req.body.password)
        .then(data => {
            res.redirect('/user/login')
        })
        .catch(err => {
            res.redirect('back')
        })
})

router.get('/logout', auth, (req, res) => {
    req.session.userid = null
    req.flash('success_message', 'Logout Success')
    res.redirect('/user/login')
})

module.exports = router
