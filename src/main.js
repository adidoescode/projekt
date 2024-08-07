"use strict";

// Nav-meny

let openBtn = document.getElementById("open-menu");
let closeBtn = document.getElementById("close-menu");
let navMenuEl = document.getElementById("nav-menu");

openBtn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);

function toggleMenu() {


    if (navMenuEl.style.display === "none" || navMenuEl.style.display === "") {
        navMenuEl.style.display = "block";
    }
    else {
        navMenuEl.style.display = "none";
    }
}

// Hämtar api om tävlingar genom RapidAPI

const url = 'https://live-golf-data.p.rapidapi.com/schedule?orgId=1&year=2024';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '9795d46397msh5ec52a2ad48e162p1265b4jsne06838ef29ad',
        'X-RapidAPI-Host': 'live-golf-data.p.rapidapi.com'
    }
};

// Fetchar och storear data i result-variabeln 

async function fetchData() {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        await formatTournaments(result);
    } catch (error) {
        console.error(error);
    }
}

// Hämtar data om spelare genom RapidAPI

const playerUrl = 'https://live-golf-data.p.rapidapi.com/stats?year=2024&statId=186';
const playerOptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '9795d46397msh5ec52a2ad48e162p1265b4jsne06838ef29ad',
        'X-RapidAPI-Host': 'live-golf-data.p.rapidapi.com'
    }
};
async function fetchRanking() {
    try {
        const response = await fetch(playerUrl, playerOptions);
        const data = await response.json();
        await displayRanking(data.rankings);
    } catch (error) {
        console.error(error);
    }
}

// Den primära funktionen i scripten. Den tar hand om filtrering av tider, utskrivning av tävlingar och datum.

async function formatTournaments(result) {

    // Deklarerar variablerna så dom är tillgängliga inom hela funktionen.

    let upcomingArray = [];
    let nextArray = [];

    result.schedule.forEach(dateCheck => {

        // Hämtar det aktuella datumet och tävlingarnas datum.

        const date = new Date();
        const tournamentStartDate = new Date(parseInt(dateCheck.date.start["$date"]["$numberLong"]));

        // Filtrerar bort tävlingarna som har vart och pushar kommande tävlingar till variablerna samt raderar tidigare tävlingar.
        if (tournamentStartDate >= date) {
            upcomingArray.push(dateCheck);
            nextArray.push(dateCheck);
        }
    });

    // Lagrar de tre första tävlingarna i slicedNext-variabeln. Detta beror på att jag vill highlighta de tävlingar som närmar sig.

    const slicedUpcoming = upcomingArray.slice(3);
    const slicedNext = nextArray.slice(0, 3);
    slicedUpcoming.forEach(formatObject => {

        // Hämtar starttid och dag för tävlingarna samt omvandlar det till amerikansk tidzon för exakt information då tävlingarna spelas i USA.

        const getStartDate = formatObject.date.start["$date"]["$numberLong"];
        const startDate = new Date(parseInt(getStartDate));
        const formattedDate = startDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long"
        });

        // Ger dagen en stor bokstav i början.

        const capitalDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

        // Deklarerar variabler som kommer printa ut elementen inom html:en. Såhär kommer utskriften se ut: <ul><li><a>***</a></li></ul>

        const tourDivEl = document.getElementById("tour-div");
        const tourUpcomingEl = document.getElementById("tour-upcoming");
        const tourLiEl = document.createElement("li");
        // Kommande tävlingar

        if (tourDivEl && tourUpcomingEl) {
            const tourLiText = document.createTextNode(formatObject.name);
            const upcomingDate = document.createTextNode(" " + capitalDate);

            tourLiEl.appendChild(tourLiText);
            tourLiEl.appendChild(upcomingDate)

            tourUpcomingEl.appendChild(tourLiEl);

            tourDivEl.appendChild(tourUpcomingEl);
        }
    });


    // Tävlingar som sänds snart.

    slicedNext.forEach(nextTournament => {

        // Hämtar tid som gjort i tidigare .forEach funktion.

        const getStartDate = nextTournament.date.start["$date"]["$numberLong"];
        const startDate = new Date(parseInt(getStartDate));
        const formattedDate = startDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long"
        });
        const capitalDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

        // Variabler som kommer utgöra html:en för snart kommande tävlingar.

        const tourNextLiEl = document.createElement("li");
        const tourNextEl = document.getElementById("tour-next");

        if (tourNextEl) {

            const tourNextLiText = document.createTextNode(nextTournament.name)
            const nextDate = document.createTextNode(" " + capitalDate);


            tourNextLiEl.appendChild(tourNextLiText);
            tourNextLiEl.appendChild(nextDate)

            tourNextEl.appendChild(tourNextLiEl);

        }
    });
}


// Visar live världsranking av spelare.

async function displayRanking(rankings) {

    let topRanks = rankings.slice(0, 50);
    const rank = document.getElementById("ranking");
    const name = document.getElementById("name");
    const totalPoints = document.getElementById("total-points");
    const averagePoints = document.getElementById("average-points");
    const pointsWon = document.getElementById("points-won");
    const pointsLost = document.getElementById("points-lost");
    const eventsPlayed = document.getElementById("events-played");
    if (rank && name && totalPoints && averagePoints && pointsWon && pointsLost && eventsPlayed) {


        topRanks.forEach(stats => {

            const divider = document.createElement("hr")
            const rankEl = document.createElement("li");
            const nameEl = document.createElement("li");
            const totalPointsEl = document.createElement("li");
            const averagePointsEl = document.createElement("li");
            const pointsWonEl = document.createElement("li");
            const pointsLostEl = document.createElement("li");
            const eventsPlayedEl = document.createElement("li");


            const rankElText = document.createTextNode(stats.rank['$numberInt']);
            const nameElText = document.createTextNode(stats.fullName);
            const totalPointsElText = document.createTextNode(stats.totalPoints['$numberDouble']);
            const averagePointsElText = document.createTextNode(stats.avgPoints['$numberDouble']);
            const pointsWonElText = document.createTextNode(stats.pointsGained['$numberDouble']);
            const pointsLostElText = document.createTextNode(stats.pointsLost['$numberDouble']);
            const eventsPlayedElText = document.createTextNode(stats.events['$numberInt']);

            rankEl.appendChild(rankElText);
            nameEl.appendChild(nameElText);
            totalPointsEl.appendChild(totalPointsElText);
            averagePointsEl.appendChild(averagePointsElText);
            pointsWonEl.appendChild(pointsWonElText);
            pointsLostEl.appendChild(pointsLostElText);
            eventsPlayedEl.appendChild(eventsPlayedElText);

            rank.appendChild(rankEl);
            rank.appendChild(divider.cloneNode());
            name.appendChild(nameEl);
            name.appendChild(divider.cloneNode());
            totalPoints.appendChild(totalPointsEl);
            totalPoints.appendChild(divider.cloneNode());
            averagePoints.appendChild(averagePointsEl);
            averagePoints.appendChild(divider.cloneNode());
            pointsWon.appendChild(pointsWonEl);
            pointsWon.appendChild(divider.cloneNode());
            pointsLost.appendChild(pointsLostEl);
            pointsLost.appendChild(divider.cloneNode());
            eventsPlayed.appendChild(eventsPlayedEl);
            eventsPlayed.appendChild(divider.cloneNode());

        });
    }
}

// Kör programmen.

fetchData();
fetchRanking();
