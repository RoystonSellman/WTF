var express = require('express');
var router = express.Router();

/* PostgreSQL and PostGIS module and connection setup */
var pg = require("pg"); // require Postgres module
var conString = "postgres://stone:pBgy^CcY@localhost/stone"; // Your Database Connection

// Set up your database query to display GeoJSON
//var paoilandgas_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(ST_MakePoint(lg.well_latitude, lg.well_longitude, lg.well_longitude))::json As geometry, row_to_json((well_permit_num, farm_name)) As properties FROM paoilandgasimport As lg) As f) As fc";
//   var coffee_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((id, name)) As properties FROM cambridge_coffee_shops As lg) As f) As fc";
var paoilandgas_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(ST_MakePoint(lg.well_longitude, lg.well_latitude))::json As geometry, row_to_json((well_permit_num, farm_name)) As properties FROM paoilandgasimport As lg) As f) As fc";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Postgres JSON data */
router.get('/data', function (req, res) {
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query(paoilandgas_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows[0].row_to_json);
        res.end();
    });
});
module.exports = router;
