var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

/** custom dependencies */
const cookieSession = require('cookie-session')
const flash = require('connect-flash')
/** custom dependencies */

/** custom middlewares */
const auth = require('./middlewares/auth')
const guest = require('./middlewares/guest')
/** custom middlewares */

//html
const usersRouter = require('./routes/users')
const restaurantRouter = require('./routes/restaurants')

//json
const restaurantApiRouter = require('./routes/api/restaurants')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

/** middleware setup */
app.use(
    cookieSession({
        name: 'session',
        keys: ['key1', 'key2'],
        maxAge: 24 * 60 * 60 * 1000
    })
)
app.use(flash())
app.use((req, res, next) => {
    res.locals.flash_success_message = req.flash('success_message')
    res.locals.flash_failure_message = req.flash('failure_message')
    next()
})
/** middleware setup */

/** routes goes here */
app.use('/user', usersRouter)
app.use('/restaurant', auth, restaurantRouter)
// app.use('/api/restaurant', auth, restaurantApiRouter)
app.use('/api/restaurant', restaurantApiRouter)
/** routes goes here */

app.get('/', (req, res) => {
    res.redirect('/user/login')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
