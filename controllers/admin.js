
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
    console.log(req.session);
    let id = req.sessionID;
    WeatherData.delete(id)
        .then(result => {
            console.log(result);
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.editName = (req, res, next) => {
    let str = req.body.editIdInput;
    // for some reason I am getting an empty space at the end of my id string throwing an error.
    let index0 = str.split(' ');
    let id = index0[0];
    // console.log(id.length);
    let name = req.body.editNameInput;

    WeatherData.editName(id, name)
        .then( () => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
}