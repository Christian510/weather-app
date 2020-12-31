
const WeatherData = require('../models/WeatherData');

// Displays all saved Locations on edit page.
exports.editList = (req, res, next) => {
    let id = req.sessionID;
    WeatherData.getSavedSearchList(id, cities => {
        res.render('admin/edit-list', {
            title: 'Basic Weather',
            cities: cities,
        });
    });
}

// DELETE ITEM FROM SAVED LOCATIONS
exports.deleteItem = (req, res, next) => {
    console.log(req.body.idInput);
    let cityId = req.body.idInput;
    let sessionId = req.sessionID;
    WeatherData.delete(cityId, sessionId);
    res.redirect('/');
}

exports.editName = (req, res, next) => {
    console.log(req.body);
    let str = req.body.editIdInput;
    let index0 = str.split(' ');
    let cityId = index0[0];
    let sessionId = req.sessionID;
    let newName = req.body.editNameInput;

    WeatherData.editName(cityId, sessionId, newName)
    res.redirect('/');
}