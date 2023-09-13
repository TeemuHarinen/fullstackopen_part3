require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URL
console.log(url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    validate: {
      validator: function(value) {
        return value.length >= 3
      },
      message: () => 'Name has to be at least 3 characters long'
    }
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function(value) {
        return (/^\d{2,3}-\d+$/.test(value))
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'User phone number is required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)