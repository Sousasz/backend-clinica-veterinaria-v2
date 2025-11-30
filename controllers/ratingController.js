const RatingService = require('../models/RatingService');
const jwt = require('jsonwebtoken');

exports.createRating = async (req, res) => {
  try {
    // aceitar token tanto em Authorization: Bearer <token> quanto em x-auth-token
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      token = req.headers['x-auth-token'] || req.header('x-auth-token');
    }
    if (!token) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user?.id || decoded.id;

    const { stars, comment } = req.body;

    const result = await RatingService.createRating({
      user: userId,
      stars,
      comment,
    });

    res.status(result.status).json(result);

  } catch (error) {
    console.error('Erro no ratingController.createRating:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor ao publicar avaliação' });
  }
};

exports.getRatings = async (req, res) => {
  try {
    const ratings = await RatingService.getRatings();
    res.status(200).json(ratings);
  } catch (error) {
    console.error('Erro no ratingController.getRatings:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar avaliações' });
  }
};
