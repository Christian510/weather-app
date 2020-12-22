// RETURNS AN ADDRESS OBJECT USED RETRIEVE WEATHER DATA
const addr = {
  city: '',
  state: '',
  country: '',
  abbr: ''
};

const validateAdr = str => {
  let splitStr = str.trim().split(", ").filter(elm => elm !== '');
  addr.city = splitStr[0].split(' ').map(elm => {
    return elm.charAt(0).toUpperCase() + elm.slice(1);
  }).join(' ');
  if (splitStr.length < 2) {
    // message sent to user to include a state or country
    console.log("state, provice, or country required!");
    return null;
  }
  if (splitStr.length === 2) {
    // Validate for just a city, state/country
    addr.abbr = splitStr[1].toUpperCase();
  }
  else if (splitStr.length === 3) {
    // Validates for city, state, country
    addr.state = splitStr[1].toUpperCase();
    addr.country = splitStr[2].toUpperCase();
  }
  return addr;
}


exports.validateAdr = validateAdr;