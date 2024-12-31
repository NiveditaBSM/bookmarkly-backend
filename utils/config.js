require('dotenv').config()

const password = encodeURIComponent(process.env.MONGODB_PASS);
//const uri = `mongodb+srv://${process.env.MONGODB_USER}:${password}@practice.6gl40.mongodb.net/?retryWrites=true&w=majority&appName=practice`
//console.log('uri', uri);
const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI
//console.log(MONGODB_URI)
const PORT = process.env.PORT
const EMAIL = process.env.EMAIL
const EMAIL_PASS = process.env.EMAIL_PASS

module.exports = {
    MONGODB_URI, PORT, EMAIL, EMAIL_PASS
}

