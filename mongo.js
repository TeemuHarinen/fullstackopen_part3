const mongoose = require('mongoose')

if ((process.argv.length !== 3) && (process.argv.length < 5)) {
  console.log('Input 3 arguments to view database or 5 to add')
  process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://teemuharinen:${password}@cluster0.ptp4sds.mongodb.net/personApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(res => {
    res.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })

} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(() => {
    console.log(`Added ${person.name} ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}


