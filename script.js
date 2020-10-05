var apiKey = "0ae7c8d78c752b325d6cfe515a691b24";
// api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt=6&appid={API key}

// var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputCityEl + "&appid=" + apiKey;


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var inputCityEl;

JSON.parse(localStorage.getItem("city"));
// console.log(JSON.parse(localStorage.getItem("city")));






$(".btn").on("click", function (event) {
    event.preventDefault();

    $(".forecastContainer").css("visibility", "visible");

    inputCityEl = capitalizeFirstLetter($("input").val().trim());

    // weather or forecast
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCityEl + "&appid=" + apiKey;

    // console.log(queryURL);
    // console.log(inputCityEl);

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            // console.log(response);
            // console.log(inputCityEl);

            // Current weather stats
            function weather() {
                $("#city").text((inputCityEl) + " (" + moment().format('L') + ") ");
                $("#city").append("<img src=http://openweathermap.org/img/w/" + response.weather[0].icon + ".png>")
                var tempF = parseInt((response.main.temp - 273.15) * 1.80 + 32);
                $("#currentTemp").text("Temperature: " + tempF + "\xB0F");
                $("#currentHumidity").text("Humidity: " + response.main.humidity);
                $("#currentWindSpeed").text("Wind Speed: " + response.wind.speed.toFixed(2) + " MPH");
                var lon = response.coord.lon;
                var lat = response.coord.lat;
                // console.log(lon);
                // console.log(lat);

                // Current weather UV Index
                // Color for favorable(Green) 0-2, moderate(orange) 3-7, severe(red) 8+
                $.ajax({
                    url: ("http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey),
                    method: "GET"
                })
                    .then(function (response) {
                        // console.log(response);

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

                //5 day forecast
                $.ajax({
                    url: ("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly,alerts&appid=" + apiKey),
                    method: "GET"
                })
                    .then(function (response) {
                        // console.log(response);
                        for (let i = 1; i < 6; i++) {
                            $("#date" + i).text(moment().add(i, 'd').format('L'));
                            // $("#weather" + i).text(response.daily[i].weather[0].description);
                            $("#weather" + i).html("<img src=http://openweathermap.org/img/w/" + response.daily[i].weather[0].icon + ".png alt='weather icon'/>")
                            var tempF = parseInt((response.daily[i].temp.day - 273.15) * 1.80 + 32);
                            $("#temp" + i).text("Temp: " + tempF + "\xB0F");
                            $("#humidity" + i).text("Humidity: " + response.daily[i].humidity);
                        }
                    });
            }
            weather();

            // History
            var history = $("<li>")
            history.addClass("list-group-item")
            history.text(inputCityEl)
            history.attr("value", inputCityEl)
            $(".list-group").prepend(history);
        });


    // console.log(JSON.parse(localStorage.getItem("city")));
    localStorage.setItem("city", JSON.stringify(inputCityEl));



    $(".list-group-item").on("click", function (event) {
        event.preventDefault();
        console.log("History Clicked");
        var historyClicked = $(this).attr("value");
        console.log(historyClicked);

        inputCityEl = historyClicked;

        // weather or forecast
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCityEl + "&appid=" + apiKey;

        // console.log(queryURL);
        // console.log(inputCityEl);

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                // console.log(response);
                // console.log(inputCityEl);

                // Current weather stats
                function weatherHistory() {
                    $("#city").text((inputCityEl) + " (" + moment().format('L') + ") ");
                    $("#city").append("<img src=http://openweathermap.org/img/w/" + response.weather[0].icon + ".png>")
                    var tempF = parseInt((response.main.temp - 273.15) * 1.80 + 32);
                    $("#currentTemp").text("Temperature: " + tempF + "\xB0F");
                    $("#currentHumidity").text("Humidity: " + response.main.humidity);
                    $("#currentWindSpeed").text("Wind Speed: " + response.wind.speed.toFixed(2) + " MPH");
                    var lon = response.coord.lon;
                    var lat = response.coord.lat;
                    // console.log(lon);
                    // console.log(lat);

                    // Current weather UV Index
                    // Color for favorable(Green) 0-2, moderate(orange) 3-7, severe(red) 8+
                    $.ajax({
                        url: ("http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey),
                        method: "GET"
                    })
                        .then(function (response) {
                            // console.log(response);

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

                    //5 day forecast
                    $.ajax({
                        url: ("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly,alerts&appid=" + apiKey),
                        method: "GET"
                    })
                        .then(function (response) {
                            // console.log(response);
                            for (let i = 1; i < 6; i++) {
                                $("#date" + i).text(moment().add(i, 'd').format('L'));
                                // $("#weather" + i).text(response.daily[i].weather[0].description);
                                $("#weather" + i).html("<img src=http://openweathermap.org/img/w/" + response.daily[i].weather[0].icon + ".png alt='weather icon'/>")
                                var tempF = parseInt((response.daily[i].temp.day - 273.15) * 1.80 + 32);
                                $("#temp" + i).text("Temp: " + tempF + "\xB0F");
                                $("#humidity" + i).text("Humidity: " + response.daily[i].humidity);
                            }
                        });
                }
                weatherHistory();

            });




    });




});


