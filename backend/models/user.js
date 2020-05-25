const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
})

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'creator'
})

userSchema.pre('save', async function (next) {

    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 13)

    next()
})
userSchema.methods.generateAuthentication = async function () {

    const token = jwt.sign({ _id: this._id.toString() }, 'secret')
    this.tokens = this.tokens.concat({ token })

    // login from multiple devices
    await this.save()

    return token
}

userSchema.statics.findToLogin = async function (data) {

    const user = await User.findOne({ email: data.email })

    if (!user) throw new Error('Unable to login')

    const isTheSame = await bcrypt.compare(data.password, user.password)
    if (isTheSame)
        return user

    else throw new Error('Unable to login')

}

const User = mongoose.model('User', userSchema)

module.exports = User