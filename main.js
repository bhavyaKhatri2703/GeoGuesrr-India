
let map
let marker
const container = document.getElementById("map")

container.addEventListener("mouseover", () =>
{
    container.style.height = "400px";
    container.style.width = "600px";

})

container.addEventListener("mouseout" , () =>
{
    container.style.height = "200px";
    container.style.width = "300px";
})

function initMap() {
    map = new google.maps.Map((document.getElementById("map")),
        {
            center: { lat: 22.719497, lng: 78.224407 },
            zoom: 4
        }) 


    let marked = {}

    
    const location_marker = document.createElement("img")

    location_marker.src = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";


    map.addListener("click", (e) => {
        
        const clicked = e.latLng;
        if (marker) {
            marker.setMap(null);
        }
        marker = new google.maps.Marker(
            {
                position: { lat: clicked.lat(), lng: clicked.lng() },
                map: map,
                content : location_marker,
            }
        )
        marked.lat = clicked.lat();
        marked.lng = clicked.lng();
    }
    )
    function generateRandomCoords() {
        const north = 34.107657
        const south = 8.074398
        const west = 88.881705
        const east = 73.0835349

        const randomLat = Math.random() * (north - south) + south
        const randomLng = Math.random() * (east - west) + west

        return { lat : randomLat, lng : randomLng };
    }

    const streetViewService = new google.maps.StreetViewService();
    const panorama = new google.maps.StreetViewPanorama(document.getElementById("street"),{
         
        addressControl: false
    })

    let answer = {}
    streetViewService.getPanorama({ location: generateRandomCoords(),  preference: google.maps.StreetViewPreference.NEAREST , radius: 100000 }, (res, status) => {
        if (status === "OK") {
            panorama.setPano(res.location.pano);
            panorama.setPov({ heading: 270, pitch: 0 });
            panorama.setVisible(true);
            console.log(res); 
            answer.lat = res.location.latLng.lat();
            answer.lng = res.location.latLng.lng();
        }
        else if (status === google.maps.StreetViewStatus.ZERO_RESULTS) {
           
            console.log("No Street View panorama found for the specified location.");} 
        else {
            console.log("Street View service failed", status);
        }

    })
    
    const submit_button = document.getElementById("button");
    

    submit_button.addEventListener("click", () =>
    {
        let answer_marker = new google.maps.Marker(
            {
                position :{ lat : answer.lat , lng : answer.lng},
                map : map

            }
        )

        const path_coords = [
            { lat : answer.lat, lng : answer.lng},
            { lat : marked.lat , lng : marked.lng}
        ];

        const line = new google.maps.Polyline(
            {
                path : path_coords ,
                geodesic : true,
                strokeColor : "#FF000",
                strokeOpacity : 1.0,
                strokeWeight : 2
            }
        )

        line.setMap(map)



        function toRadians(degrees) {
            return degrees * (Math.PI / 180);
        }
        
        function calcDistance(coord1, coord2) {
            const R = 6371; 
            const lat1 = toRadians(coord1.lat);
            const lon1 = toRadians(coord1.lng);
            const lat2 = toRadians(coord2.lat);
            const lon2 = toRadians(coord2.lng);
        
            const dLat = lat2 - lat1;
            const dLon = lon2 - lon1;
        
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(lat1) * Math.cos(lat2) *
                      Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
            const distance = R * c; 
            return distance;
        }

        const result_box = document.getElementById("result");

        result_box.style.display = "flex"

        
        const dist = Math.floor(calcDistance(marked,answer))

        const score = Math.floor(5000 * (Math.exp((-dist/500))))
        
        const distance_display = document.getElementById("value1")
        const score_display = document.getElementById("value2")

        distance_display.textContent = `${dist} km`;
        score_display.textContent = `${score}/5000`;

        const play_again = document.getElementById("play-again")

        play_again.addEventListener("click", () => {
            window.location.reload();
        })

        
       
        



    })
    console.log(generateRandomCoords())

};


