const bookmarkRouter = require('express').Router()
const Bookmark = require('../models/bookmark')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


bookmarkRouter.get('/', middleware.extractUser, async (request, response) => {
    const user = request.user
    const bookmarks = await Bookmark.find({ user: user._id })
    console.log(bookmarks)
    response.json({ data: bookmarks })
})

bookmarkRouter.post('/', middleware.extractUser, async (request, response) => {
    const body = request.body

    const user = request.user

    const bookmark = new Bookmark({
        title: body.title,
        author: body.author,
        url: body.url,
        summary: body.summary,
        tags: body.tags,
        user: user._id
    })

    const savedBookmark = await bookmark.save()

    user.bookmarks = user.bookmarks.concat(savedBookmark._id)
    await user.save()

    response.status(201).json({ data: savedBookmark })
})

bookmarkRouter.delete('/:id', middleware.extractUser, async (request, response) => {
    const bookmarkId = request.params.id

    const user = request.user
    const bookmark = await Bookmark.findById(bookmarkId)

    if (!user || !bookmark) {
        return response.status(404).json({ error: 'bookmark or user not found' })
    }

    if (!(user._id.equals(bookmark.user))) {
        response.status(401).json({ error: 'user unauthorized to delete bookmark' })
        return
    }

    const deletedBookmark = await Bookmark.findByIdAndDelete(bookmark._id)
    console.log('deleted bookmark: ', deletedBookmark)

    await User.updateMany(
        { bookmarks: bookmarkId },
        { $pull: { bookmarks: bookmarkId } }
    )

    response.status(200).json({ data: deletedBookmark })
})

//This router is not yet updated to use the middleware.extractUser function
bookmarkRouter.put('/:id', async (request, response, next) => {
    const id = request.params.id
    const { title, author, url, likes } = request.body

    Blog.findByIdAndUpdate(id, { title, author, url, likes },
        { new: true, runValidators: true, context: 'query' })
        .then(updatedBlog =>
            response.json(updatedBlog)
        ).catch(error => next(error))
})

module.exports = bookmarkRouter