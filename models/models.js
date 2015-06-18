var path = require('path');

//Cargar modelo ORM
var Sequelize = require('sequelize');

//Usar base de datos SQLite
var sequelize = new Sequelize(null, null, null, {
	dialect: 'sqlite',
	storage: 'quiz.sqlite'
});

//Importar la defininición de la tabla de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//Exportar definición de tabla Quiz para que esté accesible al resto de la aplicación
exports.Quiz = Quiz;

//sequelize.sync() crea e inicializa la tabla de preguntas en la base de datos
sequelize.sync().success(function() { //success(...) ejecuta el manejador una vez creada la tabla, success es la forma antigua
	Quiz.count().success(function(count) {
		if (count === 0) { //la tabla sólo se inicializa si está vacia
			Quiz.create({
					pregunta: "Capital de Italia",
					respuesta: "Roma"
				})
				.success(function() {
					console.log("Base de datos inicializada")
				});
		}
	});
});