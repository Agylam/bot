export const getCityNameByGeo = async (lat: number, lon: number) => {
        const result = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + process.env["DADATA_TOKEN"]
            },
            body: JSON.stringify({ lat, lon, count: 1 })
        })

        if(result.ok) {
            const response = await result.json();
            if(response.suggestions && response.suggestions.length > 0) {
                return response.suggestions[0].data.city
            }
        }else {
            throw new Error("Couldn't connect to DADATA'")
        }
}
