const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createPost(request, reply) {
  const { title, description } = request.body;
  const userId = parseInt(request.params.id);

  try {
    const post = await prisma.post.create({
      data: {
        title,
        description,
        userID:userId,
      },
    });
    reply.code(201).send({
      message: 'Post créé avec succès.',
      post: {
        id: post.id,
        title: post.title,
        description: post.description,
        userID: post.userID,
      },
    });
  } catch (error) {
    console.log(error);
    
    reply.code(500).send({ error: 'Une erreur est survenue lors de la création du post.', error });
  }
}

async function getAllPosts(request, reply) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true, 
      },
    });
    reply.send({
      message: 'Posts récupérés avec succès.',
      posts,
    });
  } catch (error) {
    reply.code(500).send({ error: 'Une erreur est survenue lors de la récupération des posts.' });
  }
}

async function getPostById(request, reply) {
  const { id } = request.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
      },
    });
    if (post) {
      reply.send({
        message: 'Post récupéré avec succès.',
        post,
      });
    } else {
      reply.code(404).send({ error: 'Post non trouvé.' });
    }
  } catch (error) {
    reply.code(500).send({ error: 'Une erreur est survenue lors de la récupération du post.' });
  }
}

async function updatePost(request, reply) {
  const { id } = request.params;
  const { title, description } = request.body;

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
      },
    });
    reply.send({
      message: 'Post mis à jour avec succès.',
      post: {
        id: post.id,
        title: post.title,
        description: post.description,
        userID: post.userID,
      },
    });
  } catch (error) {
    reply.code(500).send({ error: 'Une erreur est survenue lors de la mise à jour du post.' });
  }
}

async function deletePost(request, reply) {
  const { id } = request.params;

  try {
    await prisma.post.delete({
      where: { id: parseInt(id) },
    });
    reply.code(204).send({
      message: 'Post supprimé avec succès.',
    });
  } catch (error) {
    reply.code(500).send({ error: 'Une erreur est survenue lors de la suppression du post.' });
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};

