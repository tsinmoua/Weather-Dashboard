var apiKey = "0ae7c8d78c752b325d6cfe515a691b24";
// api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt=6&appid={API key}

// var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputCityEl + "&appid=" + apiKey;


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var inputCityEl;


$(".btn").on("click", function (event) {
    event.preventDefault();

    inputCityEl = capitalizeFirstLetter($("input").val().trim());

    // weather or forecast
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCityEl + "&appid=" + apiKey;

    console.log(queryURL);
    console.log(inputCityEl);


    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);
            console.log(inputCityEl);

            // Current weather stats
            function currentWeather() {
                $("#city").text((inputCityEl) + " (" + moment().format('L') + ") ICON HERE");
                var tempF = parseInt((response.main.temp - 273.15) * 1.80 + 32);
                $("#currentTemp").text("Temperature: " + tempF + "\xB0F");
                $("#currentHumidity").text("Humidity: " + response.main.humidity);
                $("#currentWindSpeed").text("Wind Speed: " + response.wind.speed.toFixed(2) + " MPH");
                var lon = response.coord.lon;
                var lat = response.coord.lat;
                console.log(lon);
                console.log(lat);

                // Current weather UV Index
                // Need color for favorable(Green), moderate(orange), severe(red)
                $.ajax({
                    url: ("http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey),
                    method: "GET"
                })
                    .then(function (response) {
                        console.log(response);
                        $("#currentUVIndex").text("UV Index: " + response.value);
                    });
            }

            currentWeather();

            // History
            var history = $("<p>")
            history.addClass("historyClick")
            history.text(inputCityEl)
            $("#history").prepend(history);
        });

        
});
