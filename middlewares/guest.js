const guest = (req, res, next) => {
    if (req.session.userid === undefined || !req.session.userid) {
        next()
    }else{
        res.redirect('/restaurant')
    }
}

module.exports = guest