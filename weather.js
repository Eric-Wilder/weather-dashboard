// Display city search history and the city's weather
$(document).ready(function () {
    displayCitySearchHistory();
    displayCityHistoryWeather();
});

// API Key from OpenWeather
const ApiKey = "bddb0e57ad566c112a3cab5588ee0e38";

// Click event handler for search button
$("#search").on("click", function () {
    var cityInput = $("#citySearched").val().trim();
    getCityWeatherInfo(cityInput);
});

// Click event handler for city search history; will display weather when a city is clicked
$("#cityList").on("click", ".cities", function () {
    var inputValue = $(this).text();
    getCityWeatherInfo(inputValue);
});

// Display weather info for stored cities
function displayCityHistoryWeather() {
    var citiesStored = JSON.parse(localStorage.getItem("citiesserched"));
    var cityName = citiesStored.cities[citiesStored.cities.length - 1];
    getCityWeatherInfo(cityName);
}

// Gets weather data for selected city
function getCityWeatherInfo(cityInput) {
    var lat, lon;
    if (cityInput) {
        var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&cnt=1&appid=" + ApiKey;
        // This ajax call will get the latitude and longitude from the given city
        $.ajax({
            url: queryUrl,
            method: "GET",
        }).then(function (res) {
            lat = res.city.coord.lat;
            lon = res.city.coord.lon;
            var queryUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&appid=" + ApiKey;
            // This ajax call will get the weather data from the given latitude and longitude
            $.ajax({
                url: queryUrl2,
                method: "GET",
            }).then(function (res2) {
                getSetCityLocalStorage(cityInput);
                displayWeatherInfo(res2, cityInput);
            });
        });
    }
}

// Get and set data from/into local storage
function getSetCityLocalStorage(city) {
    var citiesStored = JSON.parse(localStorage.getItem("citiesserched"));
    if (!citiesStored) {
        var citiesArray = [];
        if (city) {
            city = city.toUpperCase();
            citiesArray.push(city);
            var cityObject = {};
            cityObject.cities = citiesArray;
            localStorage.setItem("citiesserched", JSON.stringify(cityObject));
            displayCitySearchHistory();
        }
    } else {
        if (city) {
            city = city.toUpperCase();
            if (citiesStored.cities.indexOf(city) === -1) {
                citiesStored.cities.push(city);
            }
            localStorage.setItem("citiesserched", JSON.stringify(citiesStored));
        }
        displayCitySearchHistory();
    }
}


// Display the city search history
function displayCitySearchHistory() {
    var citiesStored = JSON.parse(localStorage.getItem("citiesserched"));
    if (citiesStored) {
        $("#cityList").empty();
        var cityArray = citiesStored.cities;

        // This loop will go through cityArray and populate the #cityList div
        for (var i = 0; i < cityArray.length; i++) {
            var pEl = $("<p class='cities border mt-0 mb-0 p-2'>").text(cityArray[i]);
            $("#cityList").append(pEl);
        }
    }
}

// Display weather info, for current weather and 5 day forcast
function displayWeatherInfo(weatherData, inputValue) {
    // Empty div to re-populate with new data
    $("#0").empty();
    $("#1").empty();
    $("#2").empty();
    $("#3").empty();
    $("#4").empty();
    $("#5").empty();

    // Displays city name and date
    var h5El = $("<h5>");
    h5El.text(inputValue.toUpperCase() + " (" + moment().format("l") + ")");

    // Displays weather image
    var iconURL = "https://openweathermap.org/img/w/" + weatherData.current.weather[0].icon + ".png";
    var imgEl = $("<img>");
    imgEl.attr("src", iconURL);
    h5El.append(imgEl);

    // Displays temperature
    $("#0").append(h5El);
    var pEl = $("<p>");
    pEl.text("Temperature: " + ((weatherData.current.temp - 273.15) * 1.80 + 32).toFixed(2) + "°F");
    $("#0").append(pEl);

    // Displays humidity
    pEl = $("<p>");
    pEl.text("Humidity: " + weatherData.current.humidity + "%");
    $("#0").append(pEl);

    // Displays wind speed
    pEl = $("<p>");
    pEl.text("Wind Speed: " + weatherData.current.wind_speed + " MPH");
    $("#0").append(pEl);

    // Displays UV Index
    pEl = $("<p>");
    pEl.text("UV Index: ");
    spanEl = $("<span>");
    if (weatherData.current.uvi <= 2) {
        spanEl.attr("class", "bg-success text-white p-1");
    } else if (weatherData.current.uvi <= 5) {
        spanEl.attr("class", "bg-warning text-white p-1");
    } else {
        spanEl.attr("class", "bg-danger text-white p-1");
    }
    spanEl.text(weatherData.current.uvi);
    pEl.append(spanEl);
    $("#0").append(pEl);

    // This loop will cycle through the IDs that are attached to the 5 Day forcast divs and display weather data for that day
    for (var i = 1; i < 6; i++) {
        var pEl = $("<p>");
        var day = moment().add(i, "days").calendar("l");
        pEl.text(day);
        var divId = "#" + i;
        $(divId).append(pEl);
        var iconURL = "https://openweathermap.org/img/w/" + weatherData.daily[i].weather[0].icon + ".png";
        var imgEl = $("<img>");
        imgEl.attr("src", iconURL);
        var pEl2 = $("<p>");
        pEl2.text("Temp: " + ((weatherData.daily[i].temp.day - 273.15) * 1.80 + 32).toFixed(2) + "°F");
        var pEl3 = $("<p>");
        pEl3.text("Humidity: " + weatherData.daily[i].humidity + "%");
        $(divId).append(imgEl, pEl2, pEl3);
    }
};



