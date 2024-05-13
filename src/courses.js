// Javascript för karta och golfbanor

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

async function fetchCourses(latitude, longitude) {
  const url = `https://golf-course-finder.p.rapidapi.com/api/golf-clubs/?latitude=${latitude}&longitude=${longitude}&miles=25`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'a7ff3bed54msh9dc5b0e57c84831p1d6d12jsn9e7346f93a31',
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
// Lägger till passiva listeners för att hindra default behaviour på scroll då det är en bugg med kartan

document.addEventListener('touchstart', function () { }, { passive: true });
document.addEventListener('touchmove', function () { }, { passive: true });

async function initAutocomplete(latitude, longitude) {
  // Skapar en ny map med ifall användaren godkänner dess plats
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

async function displayCourses(result) {
  result.forEach(course => {
    const courseListEl = document.getElementById("courseList");
    const courseLiEl = document.createElement("li");


    if (courseListEl) {
      const courseLiText = document.createTextNode(course.club_name);

      courseLiEl.appendChild(courseLiText);

      courseLiEl.setAttribute("id", "courseLink");
      courseListEl.appendChild(courseLiEl);

      courseLiEl.addEventListener('click', function () {
        courseInformation(course);
      });
    }
  });
}

async function courseInformation(course) {
  console.log(course);
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


  closeModalEl.addEventListener('click', function () {
    modalEl.style.display = "none";
    modalListEl.innerHTML = "";
  });

  window.addEventListener('click', function (event) {
    if (event.target === modalEl) {
      modalEl.style.display = "none";
      modalListEl.innerHTML = "";
    }
  });
}


getLocation(function (latitude, longitude) {
  initAutocomplete(latitude, longitude);
  fetchCourses(latitude, longitude);
});
window.initAutocomplete = initAutocomplete;