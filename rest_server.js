var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var model = require('./model');
var zookeeper = require('node-zookeeper-client');
var ZOOKEEPER_ADDRESS = "";
var znodeId = "";

var app = express();

var port = 80;

model.init(function() {
    console.log('RESTful Service listening in port', port);

    var client = zookeeper.createClient('localhost:2181');
    var path = "/members";
 
    client.once('connected', function () {
        console.log('Connected to the server.');
 
        client.create(path, function (error) {
            if (error) {
                console.log('Failed to create node: %s due to: %s.', path, error);
            } else {
                console.log('Node: %s is successfully created.', path);
            }

            client.create(
                '/members/1',
                null,
                3, // EPHEMERAL_SEQUENTIAL
                function (error, path) {
                    if (error) {
                        console.log(error.stack);
                        return;
                    }

                    console.log('Node: %s is created.', path);
                    znodeId = path;
                    console.log("Path for this server on Zk is: " + znodeId);
                    //client.close();
                    app.listen(port);
                }
            );
        });
    });
 
    client.connect();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method', {methods: ['GET', 'POST']}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.send('Zookeeper znode is ' + znodeId);
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
