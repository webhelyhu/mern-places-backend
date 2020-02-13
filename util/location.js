const axios = require('axios');

const HttpError = require('../models/http-error');

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.GOOGLE_API_KEY}`
  );

  const data = response.data;
  // console.log("data: ", data)

  if (!data || data.status === 'ZERO_RESULTS' || data.status === 'REQUEST_DENIED' || data.results.length <1 ) {
    // const error = new HttpError(
    //   'Could not find location for the specified address.',
    //   422
    // );
    // throw error;
    const location = {
      lat: 10,
      lng: 10
    }
    // console.log("        __location to return:", location)
    return location
  } else {
    // console.log("        __location _to return:", data.results[0].geometry.location)
    return data.results[0].geometry.location;
  }
}

module.exports = getCoordsForAddress;
