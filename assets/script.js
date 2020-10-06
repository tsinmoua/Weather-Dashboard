var apiKey = "0ae7c8d78c752b325d6cfe515a691b24";

// to capitalize input
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var inputCityEl;

// Check to see if local storage is empty. If not, return previous city searched.
if (localStorage.length !== 0) {
    previousCity = JSON.parse(localStorage.getItem("city"));
    // console.log(previousCity);
    weather(previousCity);
    history(previousCity);
}

// Calling for the current weather, uv index, and forecast
function weather(inputCity) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCity + "&appid=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $(".forecastContainer").css("visibility", "visible");
        localStorage.setItem("city", JSON.stringify(inputCity));
        $("#city").text((inputCity) + " (" + moment().format('L') + ") ");
        $("#city").append("<img src=https://openweathermap.org/img/w/" + response.weather[0].icon + ".png>")
        var tempF = parseInt((response.main.temp - 273.15) * 1.80 + 32);
        $("#currentTemp").text("Temperature: " + tempF + "\xB0F");
        $("#currentHumidity").text("Humidity: " + response.main.humidity + "%");
        $("#currentWindSpeed").text("Wind Speed: " + response.wind.speed.toFixed(2) + " MPH");
        var lon = response.coord.lon;
        var lat = response.coord.lat;

        $.ajax({
            url: ("https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey),
            method: "GET"
        }).then(function (response) {
            $("#currentUVIndex").text("  " + response.value);

            if (response.value >= 8) {
                $("#currentUVIndex").removeClass("favorable")
                $("#currentUVIndex").removeClass("moderate")
                $("#currentUVIndex").addClass("severe")
            } else if (response.value <= 2) {
                $("#currentUVIndex").removeClass("severe")
                $("#currentUVIndex").removeClass("moderate")
                $("#currentUVIndex").addClass("favorable")
            } else {
                $("#currentUVIndex").removeClass("favorable")
                $("#currentUVIndex").removeClass("severe")
                $("#currentUVIndex").addClass("moderate")
            }
        });

        $.ajax({
            url: ("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly,alerts&appid=" + apiKey),
            method: "GET"
        }).then(function (response) {
            // console.log(response);
            for (let i = 1; i < 6; i++) {
                $("#date" + i).text(moment().add(i, 'd').format('L'));
                $("#weather" + i).html("<img src=https://openweathermap.org/img/w/" + response.daily[i].weather[0].icon + ".png alt='weather icon'/>")
                var tempF = parseInt((response.daily[i].temp.day - 273.15) * 1.80 + 32);
                $("#temp" + i).text("Temp: " + tempF + "\xB0F");
                $("#humidity" + i).text("Humidity: " + response.daily[i].humidity + "%");
            };
        });
        // If 404 error for calls, return alert
    }).fail(function () {
        alert(inputCity + " is not a valid city. Please try again.");
    });

};

// Make a list of the cities searched
function history(inputCity) {
    var history = $("<li>")
    history.addClass("list-group-item")
    history.text(inputCity)
    history.attr("value", inputCity)
    $(".list-group").prepend(history);
}

// Click event to search for the weather
$(".btn").on("click", function (event) {
    event.preventDefault();
    inputCityEl = capitalizeFirstLetter($("#inputCity").val().trim());
    // console.log(inputCityEl);
    weather(inputCityEl);
    history(inputCityEl);

    $(".list-group-item").on("click", function (event) {
        event.preventDefault();
        // console.log("CLICKED");
        var historyClicked = $(this).attr("value");
        // console.log(historyClicked);
        weather(historyClicked);
    });
});




