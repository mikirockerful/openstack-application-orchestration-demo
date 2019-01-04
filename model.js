// MongoDriver client
var MongoClient = require('mongodb').MongoClient;

// Database URL
var db_url = 'mongodb://'+process.env.MONGODB_IP+':27017/';

// Global variable for the database connection
var db;

// Inits the connection with the database
exports.init = function (callback) {
	console.log('Connecting to the database', db_url, '...');

	// Implementar conexión a la base de datos
	// El objeto de base de datos que devuelve la función de conexión debe asignarse a la variable global 'db'
	// Una vez conectado correctamente debe llamarse a la función 'callback'
	MongoClient.connect(db_url, function(err, dbo) {
    	db = dbo.db("zips_small");
		callback();
	});
}

// Returns a list of the available restaurants in the database
exports.list = function (query, callback, error) {
	console.log('Getting restaurants list. Query: ', query);
	
	// Implementar consulta para listar los restaurantes disponibles. 
	// El array de restaurantes debe devolverse como parámetro de la función callback
	db.collection("restaurants").find(query).toArray(function(err, result){
		if (err) {
			error(err);
		} else {
			callback(result);	
		}
	});	
}

// Returns the details of a restaurant in the database
exports.read = function (restaurantId, callback, error) {
	console.log('Getting restaurant', restaurantId);

	// Implementar consulta para obtener los detalles del restaurante con 'restaurant_id' = restaurantId
	// El json con los detalles del restaurante debe devolverse como parámetro de la función callback
	query = {"restaurant_id" : restaurantId};
	db.collection("restaurants").findOne(query, function(err, restaurant){
		if (err) {
			return error(err);
		} else {
			callback(restaurant);	
		}
	});
}

// Creates a new restaurant in the database
exports.create = function (data, callback, error) {
	console.log('Creating restaurant with data', data);
	
	// Implementar creación de restaurante con los datos contenidos en 'data'. 
	// Una vez creado satisfactoriamente debe llamarse a la función 'callback'

	var restaurant_id = "31415926" + Math.floor(Math.random() * (10000000 - 0));
	data["restaurant_id"] = restaurant_id;
	db.collection("restaurants").insert(data, function(err, result) {
		if (err) {
			return error(err);
		} else {
			callback(result);
		}
	});
}

// Updates the details of a restaurant in the database
exports.update = function (restaurantId, data, callback, error) {
	console.log('Updating restaurant', restaurantId, 'with data', data);
	
	// Implementar actualización de restaurante con los datos contenidos en 'data'. 
	// Una vez actualizado satisfactoriamente debe llamarse a la función 'callback'
	query = {"restaurant_id" : restaurantId};
	set = {"$set": data}
	db.collection("restaurants").update(query, set, function(err, result) {
		if (err) {
			return error(err);
		} else {
			callback(result);
		}
	});
}

// Removes a restaurant from the database
exports.delete = function (restaurantId, callback, error) {
	console.log('Deleting restaurant', restaurantId);

	// Implementar borrado de restaurante del restaurante con 'restaurant_id' = restaurantId
	// Una vez borrado satisfactoriamente debe llamarse a la función 'callback'
	query = {"restaurant_id" : restaurantId};
	db.collection("restaurants").remove(query, function(err, restaurant){
		if (err) {
			return error(err);
		} else {
			callback(restaurant);	
		}
	});
}
