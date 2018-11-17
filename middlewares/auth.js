const auth = (req, res, next) => {
    if (req.session.userid === undefined || !req.session.userid) {
        res.redirect('../../user/login')
    }else{
        next()
    }
}

module.exports = auth