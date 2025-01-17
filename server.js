const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
const connectDB = require('./services/connectDB')

connectDB();

app.listen((config.PORT || 3000), () => {
    logger.info(`Server running on port ${config.PORT}`)
})