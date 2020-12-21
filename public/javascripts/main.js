

const precip = {
  precipitation: '',
  type: '',
}
const checkPrecip = (rain, snow) => {
    // let precipitation;
    if (rain !== undefined) {
      precip.precipitation = rain['1h'];
      precip.type = "rain";
    }
    if (snow !== undefined) {
      precip.precipitation = snow['1h'];
      precip.type = "snow";
    } else {
      precip.precipitation = '0';
      // precip.type = 'none';
    }
    return precip;
  }

  // console.log(precip);
  exports.checkPrecip = checkPrecip;
  exports.precip = precip;