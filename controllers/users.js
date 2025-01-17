const userRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { sendVerificationEmail } = require('../services/emailService');
const config = require('../utils/config')
const connectDB = require('../services/connectDB')


userRouter.post('/register', async (request, response) => {
    await connectDB();
    const { username, email, password } = request.body;
    const saltRounds = 10
    try {

        const existingUser = await User.findOne({ email });
        if (existingUser) return response.status(400).json({ status: 'failed', message: 'User already exists with this email id, try logging in' });


        if (password.length < 3) {
            return response.status(400).json({ status: 'failed', message: 'password: is expected to have at least 3 characters' })
        }

        const passwordHash = await bcrypt.hash(password, saltRounds)

        const userToAdd = new User({
            username,
            email,
            passwordHash: passwordHash,
            isVerified: false,
        })

        await userToAdd.save()

        const token = jwt.sign({ email: userToAdd.email, id: userToAdd._id }, config.SECRET, { expiresIn: '24h' })

        const verificationLink = `${request.protocol}://${request.get('host')}/api/users/verify?token=${token}`;

        await sendVerificationEmail(verificationLink, userToAdd);

        await userToAdd.save()

        response.json({ status: 'success', message: 'User created successfully, check your inbox for verification mail' });
    } catch (error) {
        response.status(500).json({ message: 'Server error', error: error.message });
    }
})


userRouter.get('/verify', async (req, res) => {
    await connectDB();
    const { token } = req.query;
    try {
        // Verify the token
        console.log('Token:', token);
        const decoded = jwt.verify(token, config.SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(400).json({ message: 'Invalid token' });
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

        // Update the user status
        user.isVerified = true;
        await user.save();

        res.redirect(`${config.FRONTEND_URL}/verification-success`);
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token', error: error.message });
    }
})

userRouter.post('/login', async (request, response) => {
    await connectDB();
    console.log('Request Body:', request.body);
    const { email, password } = request.body

    const user = await User.findOne({ email })
    const passwordMatch = user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatch) {
        return response.status(401).json({ error: 'invalid email or password' })
    }

    const userForToken = {
        email: user.email,
        id: user._id
    }

    const token = jwt.sign(userForToken, config.SECRET, { expiresIn: '24h' })

    response.json({ token, username: user.username, name: user.name })
})

userRouter.get('/', async (request, response) => {
    await connectDB();
    const users = await User.find({}).populate('bookmarks', { url: 1, title: 1, author: 1 })

    response.json(users)
})

module.exports = userRouter
