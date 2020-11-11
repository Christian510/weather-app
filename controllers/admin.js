
const WeatherData = require('../models/WeatherData');

// Displays all saved Locations on edit page.
exports.editList = (req, res, next) => {

    WeatherData.getSavedLocations(listOfSavedLocations => {
        res.render('admin/edit-list',{
            title: 'Basic Weather',
            content: listOfSavedLocations,
        });
    });
}

// Delete Item from Saved Locations
exports.deleteItem = (req, res, next) => {
    let id = req.params.id;
    WeatherData.delete(id);
    res.redirect('/');
}

exports.editName = (req, res, next) => {
    let id = req.body.id;
    let name = req.body.new_name;
    WeatherData.editName(id, name);
    res.redirect('/');
}