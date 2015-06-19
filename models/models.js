var path = require('path');

 //Postgres DATABASE_URL = postgres://user:passwd@host:port/database
 //SQLite   DATABASE_URL = sqlite://:@:/
 var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
 var DB_name  = (url[6] || null);
 var user     = (url[2] || null);
 var pwd      = (url[3] || null);
 var protocol = (url[1] || null);
 var dialect  = (url[1] || null);
 var port     = (url[5] || null);
 var host     = (url[4] || null);
 var storage  = process.env.DATABASE_STORAGE;
 
//Cargar modelo ORM
var Sequelize = require('sequelize');

//Usar Base de datos postgres o sqlite
var sequelize = new Sequelize(DB_name, user, pwd,{
	dialect: protocol,
	protocol: protocol,
	port: port,
	host: host,
	storage: storage, //Sólo SQLite (.env)
	omitNull: true  //Solo postgres
	}
);

//Usar base de datos SQLite
//var sequelize = new Sequelize(null, null, null, {
//	dialect: 'sqlite',
//	storage: 'quiz.sqlite'
//});

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