
const fs = require('fs');
const path = require('path');
const cityDir = require(process.mainModule.filename);

const p = path.join(
    path.dirname(cityDir),
    'data',
    'sample_list.json');



    const getCities = () => {
        fs.readFile(p, (err, fielContent) => {
            if (err) {
                console.log(err);
                return [];
            } else {
                return JSON.parse(fielContent);
            }
        });
    }


    function returnCityData() {
        getCities( cities => {
            console.log(cities);
        })
    }