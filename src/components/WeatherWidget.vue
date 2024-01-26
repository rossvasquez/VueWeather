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
    <div class="w-full max-w-3xl h-auto flex flex-col gap-3 select-none" v-if="weather">
        <div class="relative bg-sky-400 bg-opacity-40 shadow-sm w-full max-w-5xl h-auto rounded-[7px] overflow-hidden">
            <div class="w-full h-2 bg-sky-700" />
            <div class="flex flex-col sm:flex-row items-start">
                <div class="w-full flex flex-col gap-1 justify-start h-full p-4">
                    <p class="text-4xl font-semibold drop-shadow-sm text-sky-700">{{ weather.location.name }}, {{ weather.location.region }}</p>
                    <p class="text-2xl text-neutral-700 font-light">{{ weather.location.country }}</p>
                </div>
                <div class="w-full flex flex-col sm:items-end justify-start h-full px-4 pb-2 sm:p-4">
                    <p class="text-lg font-light text-neutral-500">Updated {{ formatDate(weather.current.last_updated, true) }}</p>
                </div>
            </div>
        </div>
        <div class="w-full h-auto flex flex-wrap gap-3">
            <div class="grow bg-sky-400 flex flex-col bg-opacity-40 shadow-sm rounded-[7px] overflow-hidden">
                <p class="font-light text-white py-2 px-4 text-xl bg-sky-700">Current</p>
                <div class="p-4">
                    <div class="flex flex-row-reverse justify-end items-center gap-6">
                        <div class="px-1 py-2 w-16 h-16 bg-white shadow-md flex justify-center items-center rounded-full">
                            <img class="-mt-2" :src="weather.current.condition.icon" />
                        </div>
                        <p class="text-5xl text-neutral-700">{{ Math.round(weather.current.temp_f) }}&deg;F</p>
                    </div>
                    <p class="pl-1 mt-2 text-2xl font-light text-neutral-700">{{ weather.current.condition.text }}</p>
                    <p class="pl-1 text-xl font-light text-neutral-500 mt-1">Feels Like: {{ Math.round(weather.current.feelslike_f) }}&deg;F</p>
                </div>
            </div>
            <div class="grow bg-sky-400 flex flex-col bg-opacity-40 shadow-sm rounded-[7px] overflow-hidden">
                <p class="font-light text-white py-2 px-4 text-xl bg-sky-700">Precip</p>
                <div class="py-2 px-6 md:px-4 flex md:block flex-col justify-center items-center">
                    <img class="w-20 mt-2" src="/precip.svg?url" />
                    <p class="md:pl-1 text-2xl font-light text-neutral-700 mt-2">{{ weather.current.precip_in }} inches</p>
                </div>
            </div>
            <div class="grow bg-sky-400 flex flex-col bg-opacity-40 shadow-sm rounded-[7px] overflow-hidden">
                <p class="font-light text-white py-2 px-4 text-xl bg-sky-700">Wind</p>
                <div class="py-2 px-6 md:px-4 flex md:block flex-col justify-center items-center">
                    <img :style="windRot" class="w-20 rotate-[]" src="/arrow.svg?url" />
                    <div class="flex md:pl-1 mt-2 text-2xl font-light text-neutral-700"><p class="mr-2">{{ wind(weather.current.wind_dir) }}</p><p>{{ Math.round(weather.current.wind_mph) }}</p><p class="text-[1rem] mt-1">MPH</p></div>
                    <p class="md:pl-1 text-xl font-light text-neutral-500">{{ Math.ceil(weather.current.gust_mph) }}<span class="text-[1rem]">MPH</span> Gusts</p>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="p-[5px] w-full max-w-5xl h-80 rounded-[7px] flex flex-col justify-center items-center p-4">
        <p class="text-3xl font-light text-sky-700 animate-pulse">Loading Weather...</p>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'

    const weather = ref<any>(null)

    const fetchWeatherData = async (lat: number, lon: number) => {
        const response = await fetch(".netlify/functions/getWeather", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "lon": lon,
                "lat": lat
            })
        })
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