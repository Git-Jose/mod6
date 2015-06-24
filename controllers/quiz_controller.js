var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye: quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
			function(quiz) {
				if (quiz) {
					req.quiz = quiz;
					next();
				} else {
					next(new Error("No existe quizId= " + quizId));
				}
			}
		)
		.catch(function(error) {
			next(error);
		});
};

//Get /quizes
exports.index = function(req, res, next) {
	if (req.query.search) {

		var buscar = (req.query.search).replace(/ /g, '%');
		models.Quiz.findAll({
			where: ["pregunta like ?", '%' + buscar + '%'],
			order: 'pregunta ASC'
		}).then(function(quizes) {
			res.render('quizes/index', {
				quizes: quizes
			});
		}).catch(function(error) {
			next(error);
		});
	} else {
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index', {
				quizes: quizes
			});
		}).catch(function(error) {
			next(error);
		});
	}
};


//Get /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', {
		quiz: req.quiz
	});
};

//Get /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = "Incorrecto";
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = "Correcto";
	}
	res.render('quizes/answer', {
		quiz: req.quiz,
		respuesta: resultado
	});
};

//Get /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build({ //Crea objeto quiz no persistente con build(..)
		pregunta: "Pregunta",
		respuesta: "Respuesta"
	});
	res.render('quizes/new', {
		quiz: quiz
	});
};

//POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	//Guarda en la BD los campos pregunta y respuesta de quiz
	quiz.save({
			fields: ["pregunta", "respuesta"]
		}).then(function() {
			res.redirect('/quizes');
		}) //Redirección HTTP (URL relativo) lista de preguntas
};