var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var model = require('./model');

var app = express();

var port = 8000;

model.init(function() {
    console.log('RESTful Service listening in port', port);
    app.listen(port);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method', {methods: ['GET', 'POST']}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.send('Restaurants REST Service\n');
})

app.get('/restaurants', function(req, res) {
    model.list(req.query, function (restaurants) {
        res.status(200).send(restaurants);
    }, function (error) {
        res.status(500).send(error);
    });
});

app.get('/restaurants/:restaurantId', function(req, res) {
    model.read(req.params.restaurantId, function (restaurant) {
        res.status(200).send(restaurant);
    }, function (error) {
        res.status(500).send(error);
    });
});

app.post('/restaurants', function(req, res) {
    model.create(req.body, function (restaurants) {
        res.status(200).send('Created');
    }, function (error) {
        res.status(500).send(error);
    });
});

app.put('/restaurants/:restaurantId', function(req, res) {
    model.update(req.params.restaurantId, req.body, function (restaurants) {
        res.status(200).send('Updated');
    }, function (error) {
        res.status(500).send(error);
    });
});

app.delete('/restaurants/:restaurantId', function(req, res) {
    model.delete(req.params.restaurantId, function (restaurants) {
        res.status(200).send('Deleted');
    }, function (error) {
        res.status(500).send(error);
    });
});

// handle 404 errors
app.use(function(req, res){
    res.status(404).send('Not found');
});
