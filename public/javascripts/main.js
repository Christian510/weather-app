
function checkPrecip(rain, snow) {
    let precipitation;
    if (rain !== undefined) {
      return precipitation = rain['1h'];
    }
    if (snow !== undefined) {
      return precipitation = snow['1h'];
    } else {
      return precipitation = '0';
    }
  }

  exports.checkPrecip = checkPrecip;