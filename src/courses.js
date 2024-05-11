// Javascript för karta och golfbanor

function getLocation(callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = JSON.parse(JSON.stringify(position.coords.latitude));
        const longitude = JSON.parse(JSON.stringify(position.coords.longitude));
        callback(latitude, longitude);
      }, function(error) {
        console.error("Geolocation error: " + error.message);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  async function fetchCourses(latitude, longitude) {
    const url = `https://golf-course-finder.p.rapidapi.com/api/golf-clubs/?latitude=${latitude}&longitude=${longitude}&miles=20`;
    console.log(url);
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'a7ff3bed54msh9dc5b0e57c84831p1d6d12jsn9e7346f93a31',
        'X-RapidAPI-Host': 'golf-course-finder.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(url, options);
      const result = await response.json(); // Assuming the API returns JSON
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
// Lägger till passiva listeners för att hindra default behaviour på scroll då det är en bugg med kartan

document.addEventListener('touchstart', function () { }, { passive: true });
document.addEventListener('touchmove', function () { }, { passive: true });

async function initAutocomplete(latitude, longitude) {
    // Skapar en ny map med vald latitud och longitud som laddas in när sidan starta
    console.log(latitude + " " +longitude);
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: +latitude, lng: longitude },
        zoom: 13,
        mapTypeId: "roadmap",
    });

    //Skapar även en marker för stället kartan laddas in på
    const initialMarker = new google.maps.Marker({
        map: map,
        position: map.getCenter(),
        title: 'Startplats för kartan'
    });
};

getLocation(function (latitude, longitude) {
    initAutocomplete(latitude, longitude);
    fetchCourses(latitude, longitude);
  });
  window.initAutocomplete = initAutocomplete;