
const addr = {
    city: '',
    state: '',
    country: '',
    abbr: ''
  };
  
  const validateAdr = str => {
    // console.log("validateAdr: ",str);
    let splitStr = str.trim().split(", ").filter(elm => elm !== '');
    // console.log(splitStr);
    addr.city = splitStr[0].split(' ').map(elm => {
      return elm.charAt(0).toUpperCase() + elm.slice(1);
    }).join(' ');
    if(splitStr.length < 2) {
      console.log("state, provice, or country required!");
      return null;
    }
    if(splitStr.length === 2) {
        addr.abbr = splitStr[1].toUpperCase();
    } 
    else if (splitStr.length ===3) {
        addr.state = splitStr[1].toUpperCase();
        addr.country = splitStr[2].toUpperCase();
    }
    return addr
  }


exports.validateAdr = validateAdr;