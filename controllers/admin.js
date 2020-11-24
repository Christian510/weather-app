
const WeatherData = require('../models/WeatherData');

// Displays all saved Locations on edit page.
exports.editList = (req, res, next) => {

    WeatherData.getSavedLocations(SavedSearches => {
        // console.log(SavedSearches);
        res.render('admin/edit-list', {
            title: 'Basic Weather',
            content: SavedSearches,
        });
    });
}

// Delete Item from Saved Locations
exports.deleteItem = (req, res, next) => {
    console.log("req body: ", req.body);
    let id = req.body.idInput;
    WeatherData.delete(id)
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.editName = (req, res, next) => {
    let id = req.body.editIdInput;
    let name = req.body.editNameInput;

    WeatherData.editName(id, name)
        .then( result => {
            console.log(result);
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
}