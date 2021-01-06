
const WeatherData = require('../models/WeatherData');
const findCitiesBySessionUser = require('../public/javascripts/util_functions').findCitiesBySessionUser;

// DISPLAYS ALL SAVED LOCATIONS ON EDIT PAGE.
exports.editList = (req, res, next) => {
    let id = req.sessionID;
    WeatherData.getSavedSearchList(id)
        .then(sessions => {
            let cities = findCitiesBySessionUser(sessions);
            res.render('admin/edit-list', {
                title: 'Basic Weather',
                cities: cities,
            });
        })
        .catch(err => {
            console.log("There is an error!");
            console.log(err);
        });
}

// DELETE ITEM FROM SAVED LOCATIONS
exports.deleteItem = (req, res, next) => {
    let cityId = req.body.idInput;
    let sessionId = req.sessionID;
    WeatherData.delete(cityId, sessionId)
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.log("There is an error!");
            console.log(err);
        });
}

exports.editName = (req, res, next) => {
    let str = req.body.editIdInput;
    let index0 = str.split(' ');
    let cityId = index0[0];
    let sessionId = req.sessionID;
    let newName = req.body.editNameInput;

    WeatherData.editName(cityId, sessionId, newName)
    .then(result => {
        console.log(`Documents modified: ${result.modifiedCount}`);
        res.redirect('/');
    })
    .catch(err => {
        console.log("There is an error!");
        console.log(err);
    });
}