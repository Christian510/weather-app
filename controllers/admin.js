
const WeatherData = require('../models/WeatherData');

// Displays all saved Locations on edit page.
exports.editList = (req, res, next) => {

    WeatherData.getSavedLocations(listOfSavedLocations => {
        // console.log(listOfSavedLocations.city);
        // let cityList = listOfSavedLocations.map(c => c.city);
        // console.log(cityList);

        res.render('admin/edit-list',{
            title: 'Basic Weather',
            content: listOfSavedLocations,
        });
    });
}

// Delete Item from Saved Locations
exports.deleteItem = (req, res, next) => {
    let array = req.body.id.split(' ');
    let id = array[0];
    WeatherData.delete(id);
    res.redirect('/');
}