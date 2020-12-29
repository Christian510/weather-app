
const WeatherData = require('../models/WeatherData');

// Displays all saved Locations on edit page.
exports.editList = (req, res, next) => {

    WeatherData.getSavedWeatherList(data => {
        // console.log(SavedSearches);
        res.render('admin/edit-list', {
            title: 'Basic Weather',
            content: data,
        });
    });
}

// Delete Item from Saved Locations
exports.deleteItem = (req, res, next) => {
    // console.log("req body: ", req.body);
    let id = req.body.idInput;
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