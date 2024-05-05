"use strict";

const url = 'https://live-golf-data.p.rapidapi.com/schedule?orgId=1&year=2024';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '7649aafa41mshd3560bd75e4c05fp11d733jsn2092bf4ecb4b',
        'X-RapidAPI-Host': 'live-golf-data.p.rapidapi.com'
    }
};

async function fetchData() {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        await formatTournaments(result);
        await displayTournaments(result);
    } catch (error) {
        console.error(error);
    }
}

async function formatTournaments(result) {
    result.schedule.forEach(formatObject => {
        const weekNum = formatObject.date.weekNumber;
        const getStartDate = formatObject.date.start["$date"]["$numberLong"];
        const startDate = new Date(parseInt(getStartDate));
        const containerEl = document.getElementById("tournaments");
        const tourDivEl = document.createElement("div");
        const tourUlEl = document.createElement("ul");
        const tourLiEl = document.createElement("li");
        tourDivEl.classList.add("tourdiv");


        
        containerEl.appendChild(tourDivEl);
        const formattedDate = startDate.toLocaleDateString("sv-SE", {
            weekday: "long",
            day: "numeric",
            month: "long"
        });
        const capitalDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        let tourform = ("Tävlingen startar: " + capitalDate + ", " + "Vecka: " + weekNum);
        console.log("Namn:" + formatObject.name);
        console.log("Tävlingen startar: " + capitalDate + ", " + "Vecka: " + weekNum);

        displayTournaments(tourform);
    })


}



async function displayTournaments(result, ) {
    console.log(result.schedule);
    result.schedule.forEach(tournament => {
    })
}

fetchData();
