"use strict";
/* calling Functions */
SetupUI();
function getPrayerTimming(date, city) {
    /* Using Morocco methode */
    let apiurl = `https://api.aladhan.com/v1/timingsByAddress/${date}?address=${city}&method=21`;
    axios
        .get(apiurl)
        .then((response) => {
        var _a, _b, _c, _d, _e, _f, _g;
        /* setup Date html */
        let dayArabicHijri = response.data.data.date.hijri.weekday.ar;
        let dayHijri = response.data.data.date.hijri.day;
        let monthHijri = response.data.data.date.hijri.month.ar;
        let yearHijri = response.data.data.date.hijri.year;
        let HijriFull = ` ${dayArabicHijri} ${dayHijri} ${monthHijri} ${yearHijri}`;
        console.log(HijriFull);
        (_a = document.getElementById("arabicDateHijri")) === null || _a === void 0 ? void 0 : _a.innerHTML = HijriFull;
        /* END setup Date html */
        /* setup cards */
        let Sunrise = response.data.data.timings.Sunrise;
        let Fajr = response.data.data.timings.Fajr;
        let Dhuhr = response.data.data.timings.Dhuhr;
        let Asr = response.data.data.timings.Asr;
        let Sunset = response.data.data.timings.Sunset;
        let Maghrib = response.data.data.timings.Maghrib;
        let Isha = response.data.data.timings.Isha;
        (_b = document.getElementById("fajrTime")) === null || _b === void 0 ? void 0 : _b.innerHTML = Sunrise;
        (_c = document.getElementById("sunriseTime")) === null || _c === void 0 ? void 0 : _c.innerHTML = Fajr;
        (_d = document.getElementById("dhuhrTime")) === null || _d === void 0 ? void 0 : _d.innerHTML = Dhuhr;
        (_e = document.getElementById("asrTime")) === null || _e === void 0 ? void 0 : _e.innerHTML = Asr;
        (_f = document.getElementById("maghribTime")) === null || _f === void 0 ? void 0 : _f.innerHTML = Maghrib;
        (_g = document.getElementById("ishaTime")) === null || _g === void 0 ? void 0 : _g.innerHTML = Isha;
        /* END setup cards */
        /* Setup Next prayer */
        /* Get time now in minute */
        const currentDate = new Date();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        let timeNowInMinutes = hours * 60 + minutes;
        /* END Get time now in minute */
        /* Compre Timenow to next prayer in minutes*/
        let prayerInMinites = [
            convertTimeToMinutes(Fajr),
            convertTimeToMinutes(Sunrise),
            convertTimeToMinutes(Dhuhr),
            convertTimeToMinutes(Asr),
            convertTimeToMinutes(Maghrib),
            convertTimeToMinutes(Isha),
        ];
        let prayerNames = [
            "الفجر",
            "الشروق",
            "الظهر",
            "العصر",
            "المغرب",
            "العشاء",
        ];
        function checkNextPrayer() {
            for (let i = 0; i < prayerInMinites.length; i++) {
                if (timeNowInMinutes < prayerInMinites[i]) {
                    document.getElementById("nextPrayer").value = prayerInMinites[i];
                    /*             document.getElementById("prayerName").innerHTML = prayerNames[i]
                     */ console.log(prayerInMinites[i]);
                    let remainingTime = prayerInMinites[i] - timeNowInMinutes;
                    startCountdown(remainingTime, prayerNames[i]);
                    return prayerInMinites[i];
                }
            }
        }
        checkNextPrayer();
    })
        .catch((err) => {
        console.log(err);
    });
}
function SetupUI() {
    let apiurl = `https://ipinfo.io/json?token=0a29e42f455d19`;
    /* get user location */
    axios
        .get(apiurl)
        .then((response) => {
        var _a;
        let userCity = response.data.city;
        console.log(userCity);
        document.getElementById("cityInputText").value = userCity;
        let dateNow = getUserDate();
        getPrayerTimming(dateNow, userCity);
        /* Start DOM */
        let arabicDate = getArabicDate();
        (_a = document.getElementById("arabicDate")) === null || _a === void 0 ? void 0 : _a.innerHTML = arabicDate;
    })
        .catch((err) => {
        console.log(err.message);
    });
}
function getUserDate() {
    const currentDate = new Date();
    // Get the current date components
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
    const day = currentDate.getDate();
    // Display the current date
    let dateNow = `${day}-${month}-${year}`;
    console.log(dateNow);
    return dateNow;
}
getArabicDate();
function getArabicDate() {
    const currentDate = new Date();
    // Specify the locale as 'ar-AE' for Arabic (United Arab Emirates)
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour12: false,
    };
    const arabicDate = currentDate.toLocaleDateString("ar-AE", options);
    console.log(`Current date in Arabic: ${arabicDate}`);
    return arabicDate;
}
function convertTimeToMinutes(time) {
    // Split the time into hours and minutes
    const [hours, minutes] = time.split(":").map(Number);
    // Convert hours to minutes and add the minutes
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes;
}
function convertMinutesToTime(totalMinutes) {
    // Calculate hours and remaining minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    // Format the result as "hh:mm"
    const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    return formattedTime;
}
let countdownTimer; // Variable to store the timer ID
function startCountdown(minutes, prayername) {
    // Clear the existing timeout if it's set
    if (countdownTimer) {
        clearTimeout(countdownTimer);
    }
    var endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + minutes);
    function updateCountdown() {
        var currentTime = new Date();
        var timeDifference = endTime - currentTime;
        if (timeDifference <= 0) {
            document.getElementById('prayerNameDiv').innerHTML = `  
        <h2 class="text-8xl lg:text-6xl p-4 m-2 text-highpurple" dir="ltr" id="nextPrayerTime"> حان وقت صلاة </h2>
        <span class="text-8xl lg:text-6xl l p-4 m-2 bg-lightred text-white px-14 rounded-md" id="prayerName lg:p-16"> ${prayername}: </span>
        <input type="hidden" value="" id="nextPrayer">
      `;
        }
        else {
            var hours = Math.floor(timeDifference / (1000 * 60 * 60));
            var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
            // Format the output as hh:mm:ss
            var formattedTime = padZero(hours) + ':' + padZero(minutes) + ':' + padZero(seconds);
            document.getElementById('prayerNameDiv').innerHTML = `  
        <h2 class="text-8xl lg:text-6xl p-4 m-2 text-highpurple" dir="ltr" id="nextPrayerTime"> الوقت المتبقي لصلاة </h2>
        <span class="text-8xl lg:text-6xl l p-4 m-2 bg-lightred text-white px-14 rounded-md" id="prayerName lg:p-16"> ${prayername}: </span>
        <input type="hidden" value="" id="nextPrayer">
        <h2 class="text-8xl lg:text-6xl p-4 m-2 text-black bg-white rounded-md" dir="ltr" id="nextPrayerTime"> ${formattedTime} </h2>
      `;
            countdownTimer = setTimeout(updateCountdown, 1000); // Update every second and store the timer ID
        }
    }
    updateCountdown();
}
function padZero(number) {
    return (number < 10 ? '0' : '') + number;
}
// Function to populate the datalist with cities
function populateDatalist() {
    const citiesDatalist = document.getElementById('citiesList');
    // Clear existing options
    citiesDatalist.innerHTML = '';
    // Add cities to the datalist
    citiesArray.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        citiesDatalist.appendChild(option);
    });
}
// Call the function to populate the datalist
populateDatalist();
document.getElementById('cityInputText').addEventListener('change', function (event) {
    // Access the selected value and do something with it
    var selectedCity = event.target.value;
    console.log('Selected city:', selectedCity);
    let dateNow = getUserDate();
    getPrayerTimming(dateNow, selectedCity);
    // If you want to save the value somewhere, you can use it as needed
    // For example, you can save it to a variable or send it to the server.
});
/* city array  */
