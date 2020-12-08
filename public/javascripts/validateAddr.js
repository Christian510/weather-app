
const location = {
    city: '',
    state: '',
    country: '',
    abbr: ''
  };
  
  const validateAdr = str => {
    // console.log("validateAdr: ",str);
    let splitStr = str.trim().split(", ").filter(elm => elm !== '');
    // console.log(splitStr);
    location.city = splitStr[0].split(' ').map(elm => {
      return elm.charAt(0).toUpperCase() + elm.slice(1);
    }).join(' ');
    if(splitStr.length === 2) {
        location.abbr = splitStr[1].toUpperCase();
    } 
    else if (splitStr.length ===3) {
        location.state = splitStr[1].toUpperCase();
        location.country = splitStr[2].toUpperCase();
    }
    return location
  }


exports.validateAdr = validateAdr;