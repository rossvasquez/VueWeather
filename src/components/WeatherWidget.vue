<script lang="ts">
    const formatDate = (date: string, myBool: boolean) => {
        const firstDash = date.indexOf('-')
        const secondDash = date.lastIndexOf('-')
        const space = date.indexOf(' ')

        const getTwelve = (time: string) => {
            const dots = time.indexOf(':')
            const hourNum = Number(time.slice(0, dots))
            const minutes = time.slice(dots+1)

            if (hourNum < 12) {

                if (hourNum == 0) {
                    return `12:${minutes} AM`
                }

                return `${hourNum}:${minutes} AM`
            }

            if (hourNum == 12) {
                return `${hourNum}:${minutes} PM`
            }

            return `${hourNum-12}:${minutes} PM`
        }

        const month = date.slice(firstDash+1, secondDash)
        const day = date.slice(secondDash+1, space)
        const time = getTwelve(date.slice(space+1))

        if (myBool) {
            return `${time}`
        }

        return `${month}/${day} ${time}`
    }

    const wind = (wind: string) => {
        if (wind.length>1) {
            return wind
        }

        let windName
        wind == 'N' ? windName = 'North' : null
        wind == 'E' ? windName = 'East' : null
        wind == 'S' ? windName = 'South' : null
        wind == 'W' ? windName = 'West' : null

        return windName
    }
</script>

<template>
    <div class="w-full max-w-3xl h-auto flex flex-col gap-3" v-if="weather">
        <div class="relative bg-sky-300 bg-opacity-40 p-4 shadow-sm w-full max-w-5xl h-auto rounded-[7px] flex items-start">
            <div class="w-full flex flex-col gap-1 justify-start h-full">
                <p class="text-4xl text-sky-700">{{ weather.location.name }}, {{ weather.location.region }}</p>
                <p class="text-2xl text-white font-light">{{ weather.location.country }}</p>
            </div>
            <div class="w-full flex flex-col items-end justify-start h-full">
                <p class="text-2xl font-light text-neutral-700">{{ formatDate(weather.location.localtime, false) }}</p>
                <p class="text-lg text-white font-light text-neutral-500">Updated {{ formatDate(weather.current.last_updated, true) }}</p>
            </div>
        </div>
        <div class="w-full h-auto flex gap-3">
            <div class="w-1/3 bg-sky-300 flex flex-col bg-opacity-40 p-4 shadow-sm rounded-[7px]">
                <p class="font-light text-neutral-500 text-xl">Temp</p>
                <div class="flex flex-row-reverse justify-end items-center gap-2">
                    <img :src="weather.current.condition.icon" />
                    <p class="text-5xl text-neutral-700">{{ Math.round(weather.current.temp_f) }}&deg;F</p>
                </div>
                <p class="pl-1 mt-2 text-2xl font-light text-neutral-700">{{ weather.current.condition.text }}</p>
                <p class="pl-1 text-xl font-light text-neutral-500 mt-1">Feels Like: {{ Math.round(weather.current.feelslike_f) }}&deg;F</p>
            </div>
            <div class="w-1/3 bg-sky-300 flex flex-col bg-opacity-40 p-4 shadow-sm rounded-[7px]">
                <p class="font-light text-neutral-500 text-xl">Precip</p>
                <img class="w-20 mt-2" src="/precip.svg?url" />
                <p class="pl-1 text-2xl font-light text-neutral-700 mt-2">{{ weather.current.precip_in }} inches</p>
            </div>
            <div class="w-1/3 bg-sky-300 flex flex-col bg-opacity-40 p-4 shadow-sm rounded-[7px]">
                <p class="font-light text-neutral-500 text-xl">Wind</p>
                <img :style="windRot" class="w-20 mt-2 rotate-[]" src="/arrow.svg?url" />
                <div class="flex pl-1 mt-2 text-2xl font-light text-neutral-700"><p class="mr-2">{{ wind(weather.current.wind_dir) }}</p><p>{{ Math.round(weather.current.wind_mph) }}</p><p class="text-[1rem] mt-1">MPH</p></div>
                <p class="pl-1 text-xl font-light text-neutral-500">{{ Math.ceil(weather.current.gust_mph) }}<span class="text-[1rem]">MPH</span> Gusts</p>
            </div>
        </div>
    </div>
    <div v-else class="bg-sky-300 bg-opacity-40 p-[5px] shadow-sm w-full max-w-5xl h-80 rounded-[7px] flex flex-col justify-center items-center p-4">
        <p class="text-3xl font-light text-white">Loading Weather...</p>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'

    const weather = ref<any>(null)

    const fetchWeatherData = async (lat: number, lon: number) => {
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=565a3c7e8bb1489fbcf201830242501 &q=${lat},${lon}&aqi=no`)
        return await response.json()
    }

    const myLoc = async (location: GeolocationPosition) => {
        weather.value = await fetchWeatherData(location.coords.latitude, location.coords.longitude)
    }

    onMounted(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(myLoc, () => {
                alert("Failed to retrieve location")
            })
        } else {
            alert("Enable Geolocation Services")
        }
    })

    const windRot = computed(() => {
        return {
            transform: `rotate(${weather.value.current.wind_degree}deg)`
        }
    })
</script>