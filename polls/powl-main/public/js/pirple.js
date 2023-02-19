M.AutoInit();

$('#addCities').on('submit', (e)=> {
    e.preventDefault();
    let citiesArr = []
    let cities = $('input[name = "cities"]:checked').serialize();

    $.ajax({
        type: 'POST',
        url: '/agentAddCitiesCovered',
        data: cities,
        success: (data) => {
            console.log(data);
        },
        error: (err) => {
            console.log(err);
        }
    })
})