const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SECRET_KEY = 'kjhgfghjklmlkjhggdfvbn,k';
const REFRESH_SECRET_KEY = 'mlkjhgvfcdxsxcfvghjklmlkjh';

function generateToken(user) {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
        },
        SECRET_KEY,
        { expiresIn: '1h' }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
        },
        REFRESH_SECRET_KEY,
        { expiresIn: '7d' }
    );
}

async function createUser(request, reply) {
    const { email, fullname, password, telephone } = request.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (existingUser) {
            return reply.code(400).send({ error: 'Un utilisateur avec cet email existe déjà.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                fullname,
                password: hashedPassword,
                telephone,
            },
        });

        reply.code(201).send({
            message: 'Utilisateur enregistré avec succès.',
            user: {
                id: user.id,
                email: user.email,
                fullname: user.fullname,
                telephone: user.telephone,
            },
        });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
        reply.code(500).send({ error: 'Erreur interne du serveur. Veuillez réessayer plus tard.' });
    }
}

async function loginUser(request, reply) {
    const { email, password } = request.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return reply.code(401).send({ error: 'Email ou mot de passe incorrect.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return reply.code(401).send({ error: 'Email ou mot de passe incorrect.' });
        }

        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        await prisma.token.create({
            data: {
                token: accessToken,
                refreshToken: refreshToken,
                userID: user.id,
            },
        });

        reply.send({
            message: 'Connexion réussie.',
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (error) {
        console.error('Erreur lors de la connexion de l\'utilisateur:', error);
        reply.code(500).send({ error: 'Erreur interne du serveur. Veuillez réessayer plus tard.' });
    }
}

module.exports = {
    createUser,
    loginUser,
};
