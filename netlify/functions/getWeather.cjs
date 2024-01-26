exports.handler = async (event) => {
    try {
        const requestData = JSON.parse(event.body);
        const lon = requestData.lon;
        const lat = requestData.lat;

        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=565a3c7e8bb1489fbcf201830242501 &q=${lat},${lon}&aqi=no`)
        const data = await response.json()

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        }
    } catch (error) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: error.message })
        }
    }
}