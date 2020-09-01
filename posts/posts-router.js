const express = require('express')

const Posts = require('../data/db')

const router = express.Router()

router.post('/', (req, res) => {
    const newPost = req.body
    const newTitle = newPost.title
    const newContent = newPost.contents
    
    Posts.insert(newPost)
    .then(post => {
        // res.status(201).json(post)
        if(newTitle && newContent){
        res.status(201).json(post)}
        else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." }) 
        }

    })
    .catch(error => {
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
})

router.post('/:id/comments', (req, res) => {
    const newPost = req.body
    const newText = newPost.text
    const {id} = req.params
    
    Posts.findById(id)
 
    .then(post => {
      
        if(post){
            Posts.insertComment(newPost)
            res.status(201).json(post)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }

        if(!newText){
            res.status(400).json({ errorMessage: "Please provide text for the comment." })
        }

    })
    .catch(error => {
        res.status(500).json({ error: "There was an error while saving the comment to the database" })
    })
})

router.get('/', (req, res) => {
    Posts.find(req.query)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(error => {
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(posts => {
        if (posts) {
            res.status(200).json(posts)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.get('/:id/comments', (req, res) => {
    // const {id} = req.params

    Posts.findPostComments(req.params.id)
    .then(posts => {
        if (posts) {
            res.status(200).json(posts)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
    .then(count => {
        if (count > 0) {
            res.status(200).json({ message: "The post has been deleted." });
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        res.status(500).json({ error: "The post could not be removed" })
    })
})

router.put('/:id', (req, res) => {
    const changes = req.body
    const newTitle = changes.title
    const newContent = changes.contents

    Posts.update(req.params.id, changes)
    .then (post => {
        if(post){
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }

        if(!newTitle || !newContent) {
            res.status(404).json({ errorMessage: "Please provide title and contents for the post." })
        }
    })
    .catch(error => {
        res.status(500).json({ error: "The post information could not be modified." })
    })
})

module.exports = router