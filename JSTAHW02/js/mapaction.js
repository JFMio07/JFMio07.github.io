let map;

const cityDistrictUrl = "https://raw.githubusercontent.com/taihochan/JsonData/main/%E5%8F%B0%E7%81%A3%E8%A1%8C%E6%94%BF%E5%9C%B0%E5%8D%80.json";
const waterDataUrl = "https://raw.githubusercontent.com/taihochan/JsonData/main/%E5%8F%B0%E7%81%A3%E8%87%AA%E4%BE%86%E6%B0%B4%E7%94%A8%E9%87%8F.json";

let dataMap = new Map();
let adminArea = null;
let waterData = null;
let loadtTmerId = -1;

// window.onload = () => {
//     LoadJSONData("adminArea", adminAreaUrl, dataMap);
//     LoadJSONData("waterData", waterDataUrl, dataMap);

//     let body = document.getElementsByTagName("body")[0];
//     let btn1 = document.getElementById("btn1");
//     let loadmsg = document.createElement("div");
//     body.insertBefore(loadmsg, btn1);
//     let dotcount = 0;
//     let loopcount = 0;
//     // console.log(datas);

//     while (dataMap.size < 2 && loopcount < 100) {
//         loopcount++;
//         // setTimeout(()=>{},5000);
//         // console.log(datas.size);
//         (function (base) {
//             setTimeout(function () {
//                 loadmsg.innerText = `資料加載中${".".repeat(base % 6)}`;
//                 console.log(dataMap);
//                 console.log(dataMap.size);
//             }, 100 * base);
//         })(loopcount);
//         // dotcount++;
//         // console.log(dotcount);
//         // console.log(datas);
//     }
//     console.log(adminArea);

//     btn1.addEventListener("click", function () {
//         console.log(datas);
//         console.log(datas.size);
//     });
// };




window.onload=()=>{
    dataMap.set("cityDistrict",LoadJSONData(cityDistrictUrl,false));
    dataMap.set("waterData",LoadJSONData(waterDataUrl,false));
    console.log(dataMap);

}




// LoadJSONData
function LoadJSONData(url,asyncType) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            return JSON.parse(this.responseText);
        }
        else {
            console.log(`Http error code : ${this.status}`);
            return null;
        }
    }
    xhr.open("GET", url,asyncType);
    xhr.send();
}
// // LoadJSONData
// function LoadJSONData(type, url, dest) {
//     let xhr = new XMLHttpRequest();
//     xhr.onload = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             dest.set(type, JSON.parse(this.responseText));
//             // console.log(dest);
//         }
//         else {
//             console.log(`Http error code : ${this.status}`);
//             // dest = null;
//         }
//     }
//     xhr.open("GET", url);
//     xhr.send();
// }


// LoadJSONData
// function LoadJSONData(callback) {
//     let xhr = new XMLHttpRequest();
//     xhr.onload = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             if(typeof callback ==="function"){
//                 callback();
//             }
//         }
//         else {
//             console.log(`Http error code : ${this.status}`);
//         }
//     }
//     xhr.open("GET", url);
//     xhr.send();
// }

// // onloadAction : cityDistrict
// function cityDistrict(dataMap){

// }



// LoadJSONData : cityDistrict
function LoadcityDistrict(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            dest.set(type, JSON.parse(this.responseText));
            // console.log(dest);
        }
        else {
            console.log(`Http error code : ${this.status}`);
            // dest = null;
        }
    }
    xhr.open("GET", url);
    xhr.send();
}

// console.log(adminArea);
// console.log(waterData);
// let yearList = [];
// let monthList = [];



const CHU = { lat: 24.760049283988955, lng: 120.9529990274559 };
const test = [
    { lat: 24.770049283988955, lng: 120.9529990274559 },
    { lat: 24.780049283988955, lng: 120.9529990274559 },
    { lat: 24.790049283988955, lng: 120.9529990274559 }
];
const iconBase =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/";

const msgString = "123456789";
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        //   center: { lat: -34.397, lng: 150.644 },
        // 24.756944196132864, 120.95241868853984
        center: CHU,
        zoom: 15,
    });

    new google.maps.Marker({
        position: CHU,
        map,
        title: "中華大學",
        icon: iconBase + "info-i_maps.png",

    });

    let infos = new Set();
    test.forEach((item, index) => {
        const marker = new google.maps.Marker({
            position: item,
            map,
            draggable: true,
            title: index.toString(),

        });

        const info = new google.maps.InfoWindow(
            { content: msgString }
        );

        infos.add(info);
        // console.log(info);

        marker.addListener("click", () => {
            infos.forEach((x) => {
                x.close();
            });
            info.open(map, marker);
        });



    });


}