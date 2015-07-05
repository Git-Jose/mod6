var models = require('../models/models.js');
var statistics = {
	preguntas: 0,
	comentarios: 0,
	media: 0,
	noComent: 0,
	siComent: 0
};

exports.buscar = function(req, res, next) {
	models.Quiz.count().then(function(cuenta) {
		statistics.preguntas = cuenta;
		models.Comment.count().then(function(count) {
				statistics.comentarios = count || 0;
			}),
			models.Comment.aggregate('QuizId', 'count', {
				distinct: true
			}).then(function(count) {
				statistics.siComent = count;
				statistics.noComent = statistics.preguntas - statistics.siComent;
				statistics.media = statistics.comentarios / statistics.preguntas;
				next();
			})
	});
};

//GET /quizes/statistics
exports.show = function(req, res) {
	res.render('quizes/statistics', {
		statistics: statistics,
		errors: []
	});
};