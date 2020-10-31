
const WeatherData = require('../models/WeatherData');

exports.editList = (req, res, next) => {

    res.render('admin/edit-list',{
        title: 'Basic Weather'
    });
}