const { createUser, loginUser } = require('../controllers/user.controller');
const {createPost, getAllPosts, getPostById, updatePost, deletePost} = require("../controllers/post.controller") ;
module.exports = async function (fastify, opts) {
  
    fastify.post('/register', createUser);
    fastify.post('/login', loginUser);
    fastify.post('/posts/:id',createPost);
    fastify.get('/posts',getAllPosts);
    fastify.get('/posts/:id',getPostById);
    fastify.put('/posts/:id',updatePost);
    fastify.delete('/posts/:id',deletePost);
  
   
  };