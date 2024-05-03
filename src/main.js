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
        const formattedDate = startDate.toLocaleDateString("sv-SE", {
            weekday: "long",
            day: "numeric",
            month: "long"
        });
        const capitalDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        console.log("Namn:" + formatObject.name);
        console.log("Tävlingen startar: " + capitalDate + ", " + "Vecka: " + weekNum);
    })

}

async function displayTournaments(result) {
    result.forEach(tournament => {

    })
}

fetchData();
