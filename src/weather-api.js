import _ from 'lodash';

var rootUrl = 'http://api.openweathermap.org/data/2.5/weather?appid=791a6708044d15e06e1a68c8d6527647';

var kelvinToC = function(kelvin){
  return Math.round(kelvin - 273.15) + '°C';
}

module.exports = function(latitude,longitude){
  var url = `${rootUrl}&lat=${latitude}&lon=${longitude}`;
  return fetch(url).then(function(response){
    return response.json()
  }).then(function(json){
    return {
      city: json.name,
      temperature: kelvinToC(json.main.temp),
      description: _.capitalize(json.weather[0].description)
    }
  })
}
