export const getCityNameByGeo = async (lat: number, lon: number): Promise<string> => {
    const result = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + process.env["DADATA_TOKEN"]
        },
        body: JSON.stringify({ lat, lon, count: 1 })
    })
        .then(response => response.json())
        .catch(error => console.error("DADATA ERROR:", error));
    return result.suggestions[0].data.city
}
