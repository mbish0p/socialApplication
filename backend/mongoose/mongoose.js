const mongoose = require('mongoose')

const monConnection = mongoose.connect('mongodb://127.0.0.1:27017/socialapp-api', {
    useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false
}, function (error) {
    if (error) {
        return console.log('Unable to connect' + error)
    }

    console.log('Connected correctly')
})

module.exports = monConnection