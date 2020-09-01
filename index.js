const express = require('express')

const postsRouter = require('./posts/posts-router')

const server = express()
server.use(express.json())

server.use("/api/posts", postsRouter)

server.get('/', (req, res) => {
    res.send(`
    <h1>Posts API Project 2 </h1>`)
})

server.listen(4000, () => {
    console.log('\n*** Server Running on http://localhost:4000 ***\n');
})