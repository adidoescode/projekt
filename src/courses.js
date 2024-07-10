// Funktion för att få användarens plats och köra callback-funktionen med latitud och longitud
function getLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = JSON.parse(JSON.stringify(position.coords.latitude));
      const longitude = JSON.parse(JSON.stringify(position.coords.longitude));
      callback(latitude, longitude);
    }, function (error) {
      console.error("Geolocation error: " + error.message);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// Asynkron funktion för att hämta golfbanor från API med användarens latitud och longitud
async function fetchCourses(latitude, longitude) {
  const url = `https://golf-course-finder.p.rapidapi.com/api/golf-clubs/?latitude=${latitude}&longitude=${longitude}&miles=25`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '9795d46397msh5ec52a2ad48e162p1265b4jsne06838ef29ad',
      'X-RapidAPI-Host': 'golf-course-finder.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    displayCourses(result);
  } catch (error) {
    console.error(error);
  }
}

// Lägger till passiva lyssnare för att förhindra standardbeteende vid scroll (en bugg med kartan)
document.addEventListener('touchstart', function () { }, { passive: true });
document.addEventListener('touchmove', function () { }, { passive: true });

// Initialiserar autocomplete för kartan med användarens latitud och longitud
async function initAutocomplete(latitude, longitude) {
  // Skapar en ny karta om användaren godkänner platsåtkomst
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: +latitude, lng: longitude },
    zoom: 13,
    mapTypeId: "roadmap",
  });

  // Skapar en markör för startplatsen på kartan
  const initialMarker = new google.maps.Marker({
    map: map,
    position: map.getCenter(),
    title: 'Startplats för kartan'
  });
};

// Visar golfbanor på sidan
async function displayCourses(result) {
  result.forEach(course => {
    const courseListEl = document.getElementById("courseList");
    const courseLiEl = document.createElement("li");
    const divider = document.createElement("hr")

    if (courseListEl) {
      const courseLiText = document.createTextNode(course.club_name);

      courseLiEl.appendChild(courseLiText);
      courseLiEl.appendChild(divider.cloneNode());
      courseLiEl.setAttribute("id", "courseLink");
      courseListEl.appendChild(courseLiEl);

      // Lägger till klickhändelse för att visa mer information om golfbanan
      courseLiEl.addEventListener('click', function () {
        courseInformation(course);
      });
    }
  });
}

// Visar detaljerad information om en golfbana i en modal
async function courseInformation(course) {
  const modalEl = document.getElementById("courseModal");
  const closeModalEl = document.getElementById("closeModal");
  const modalListEl = document.getElementById("modalList");
  modalEl.style.display = "block";

  modalListEl.innerHTML = "";

  const clubNameEl = document.createElement("li");
  const clubAddressEl = document.createElement("li");
  const clubCityEl = document.createElement("li");
  const clubHolesEl = document.createElement("li");
  const clubWebsiteEl = document.createElement("li");
  const clubPhoneEl = document.createElement("li");
  const clubRestaurantEl = document.createElement("li");

  clubNameEl.textContent = `Club Name: ${course.club_name}`;
  clubAddressEl.textContent = `Address: ${course.address}`;
  clubCityEl.textContent = `City: ${course.city}`;
  clubHolesEl.textContent = `Number of Holes: ${course.number_of_holes}`;
  clubWebsiteEl.textContent = `Website: ${course.website}`;
  clubPhoneEl.textContent = `Phone: ${course.phone}`;

  if (course.restaurant) {
    clubRestaurantEl.textContent = "This course has a restaurant.";
  } else {
    clubRestaurantEl.textContent = "This course does not have a restaurant.";
  }

  modalListEl.appendChild(clubNameEl);
  modalListEl.appendChild(clubAddressEl);
  modalListEl.appendChild(clubCityEl);
  modalListEl.appendChild(clubHolesEl);
  modalListEl.appendChild(clubWebsiteEl);
  modalListEl.appendChild(clubPhoneEl);
  modalListEl.appendChild(clubRestaurantEl);

  // Stänger modalen när användaren klickar på stäng-knappen
  closeModalEl.addEventListener('click', function () {
    modalEl.style.display = "none";
    modalListEl.innerHTML = "";
  });

  // Stänger modalen när användaren klickar utanför modalens innehåll
  window.addEventListener('click', function (event) {
    if (event.target === modalEl) {
      modalEl.style.display = "none";
      modalListEl.innerHTML = "";
    }
  });
}

// Få användarens plats och initiera kartan och hämta golfbanor
getLocation(function (latitude, longitude) {
  initAutocomplete(latitude, longitude);
  fetchCourses(latitude, longitude);
});

// Gör funktionen initAutocomplete global så att den kan användas av Google Maps API
window.initAutocomplete = initAutocomplete;
