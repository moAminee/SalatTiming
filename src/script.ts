/* calling Functions */
SetupUI();

function getPrayerTimming(date: string, city: string) {
  let apiurl = `https://api.aladhan.com/v1/timingsByAddress/${date}?address=${city}&method=8`;

  axios
    .get(apiurl)
    .then((response: any) => {
      /* setup Date html */
      let dayArabicHijri: string = response.data.data.date.hijri.weekday.ar;
      let dayHijri: string = response.data.data.date.hijri.day;
      let monthHijri: string = response.data.data.date.hijri.month.ar;
      let yearHijri: string = response.data.data.date.hijri.year;
      let HijriFull = ` ${dayArabicHijri} ${dayHijri} ${monthHijri} ${yearHijri}`;
      console.log(HijriFull);
      document.getElementById("arabicDateHijri")?.innerHTML = HijriFull;
      /* END setup Date html */
      /* setup cards */
      let Sunrise: string = response.data.data.timings.Sunrise;
      let Fajr: string = response.data.data.timings.Fajr;
      let Dhuhr: string = response.data.data.timings.Dhuhr;
      let Asr: string = response.data.data.timings.Asr;
      let Sunset: string = response.data.data.timings.Sunset;
      let Maghrib: string = response.data.data.timings.Maghrib;
      let Isha: string = response.data.data.timings.Isha;
      document.getElementById("fajrTime")?.innerHTML = Sunrise;
      document.getElementById("sunriseTime")?.innerHTML = Fajr;
      document.getElementById("dhuhrTime")?.innerHTML = Dhuhr;
      document.getElementById("asrTime")?.innerHTML = Asr;
      document.getElementById("maghribTime")?.innerHTML = Maghrib;
      document.getElementById("ishaTime")?.innerHTML = Isha;
      /* END setup cards */
      /* Setup Next prayer */
      /* Get time now in minute */
      
      const currentDate = new Date();
      const hours: number = currentDate.getHours();
      const minutes: number = currentDate.getMinutes();
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
 */            console.log(prayerInMinites[i])
            let remainingTime = prayerInMinites[i] - timeNowInMinutes 
            startCountdown(remainingTime,prayerNames[i]);
            return prayerInMinites[i];
            
          }
        }
      }
      checkNextPrayer()
      
    
      
    })
    .catch((err: string) => {
      console.log(err);
    });
}

function SetupUI() {
  let apiurl = `https://ipinfo.io/json?token=0a29e42f455d19`;
  /* get user location */
  axios
    .get(apiurl)
    .then((response) => {
      let userCity = response.data.city;
      console.log(userCity);
      document.getElementById("cityinput").value = userCity;
      let dateNow = getUserDate();
      getPrayerTimming(dateNow, userCity);
      /* Start DOM */
      let arabicDate = getArabicDate();

      document.getElementById("arabicDate")?.innerHTML = arabicDate;
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function getUserDate() {
  const currentDate = new Date();

  // Get the current date components
  const year: number = currentDate.getFullYear();
  const month: number = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
  const day: number = currentDate.getDate();

  // Display the current date
  let dateNow: string = `${day}-${month}-${year}`;
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


function startCountdown(minutes, prayername) {
  var endTime = new Date();
  endTime.setMinutes(endTime.getMinutes() + minutes);

  function updateCountdown() {
    var currentTime = new Date();
    var timeDifference = endTime - currentTime;

    if (timeDifference <= 0) {
      document.getElementById('nextPrayerTime').innerHTML = `  
        <h2 class="text-8xl lg:text-6xl p-4 m-2 text-highpurple" dir="ltr" id="nextPrayerTime"> حان وقت صلاة </h2>
        <span class="text-8xl lg:text-6xl l p-4 m-2 bg-lightred text-white px-14 rounded-md" id="prayerName lg:p-16"> ${prayername}: </span>
        <input type="hidden" value="" id="nextPrayer">
      `;
    } else {
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

      setTimeout(updateCountdown, 1000); // Update every second
    }
  }

  updateCountdown();
}

function padZero(number) {
  return (number < 10 ? '0' : '') + number;
}




