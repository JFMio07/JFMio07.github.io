
const cityDistrictUrl = "https://raw.githubusercontent.com/taihochan/JsonData/main/%E5%8F%B0%E7%81%A3%E8%A1%8C%E6%94%BF%E5%9C%B0%E5%8D%80.json";
// const waterDataUrl = "https://raw.githubusercontent.com/taihochan/JsonData/main/%E5%8F%B0%E7%81%A3%E8%87%AA%E4%BE%86%E6%B0%B4%E7%94%A8%E9%87%8F.json";
const waterDataUrl = "https://raw.githubusercontent.com/JFMio07/FileStorage/main/%E5%8F%B0%E7%81%A3%E6%AF%8F%E6%97%A5%E8%87%AA%E4%BE%86%E6%B0%B4%E7%94%A8%E9%87%8F.json";

let map;
let markers = [];
let infos = [];
let dataMap;
let container, body, cityDistrict, waterData;
const iconPath = "./images/icons/"
const Taiwan = { lat: 23.885536351487243, lng: 120.2807758002728 };



window.onload = () => {
    dataMap = new Map();
    let tplInitDataLoading = document.getElementById("tpl-initDataLoading").content.cloneNode(true);
    container = document.querySelector(".container");
    body = document.getElementsByTagName("body")[0];
    body.insertBefore(tplInitDataLoading, container);
    WaitasyncTasks([LoadCityDistrict, LoadWaterData], UIInitialzie);
}


function UIInitialzie() {

    waterData = dataMap.get("WaterData").TaiwanWaterExchangingData
        .StatisticofWaterResourcesClass.StatisticofWaterUsageClass.TheConsumptionOfWater;

    cityDistrict = dataMap.get("CityDistrict").map((x) => {
        return {
            City: x.City === "臺北市" ? "台北市" : x.City,
            District: x.District,
            Lat: x.Lat,
            Lng: x.Lng
        }
    });


    // tpl-yearSelect-option
    let row = container.querySelector(".row:nth-child(1)");
    let tplyearSelect = document.getElementById("tpl-yearSelect").content.cloneNode(true);
    let yearSelect = tplyearSelect.querySelector("#yearSelect");

    let yearList = new Set(waterData.map((item) => item.Year));
    yearList.forEach((value) => {
        let tplselectopt = tplyearSelect.getElementById("tpl-yearSelect-option").content.cloneNode(true);
        let opt = tplselectopt.querySelector("option");
        opt.value = value;
        opt.textContent = `${value.toString()}${"年"}`;
        yearSelect.appendChild(tplselectopt);
    });

    tplyearSelect.querySelector("button").addEventListener("click", Process);
    row.appendChild(tplyearSelect);

    initDataLoading = document.querySelector(".initDataLoading");
    for (let i = 0; i <= 10; i++) {
        setTimeout(() => {
            // debugger;
            // console.log(i);
            initDataLoading.style.opacity = (10 - i) / 10;
            if (i === 10) {
                body.removeChild(initDataLoading);
            }
        }, 70 * i);
    }
}


// WaitasyncTasks
function WaitasyncTasks(asyncTasks, callback) {
    let taskCount = asyncTasks.length;
    let finished = [];

    function Checkfinished(name) {
        finished.push(name);
        if (finished.length === taskCount) {
            callback();
        }
    }
    asyncTasks.forEach((task) => {
        task(Checkfinished);
    });
}

// LoadCityDistrict
function LoadCityDistrict(checkfinished) {
    LoadDataByXHR("CityDistrict", cityDistrictUrl, dataMap, checkfinished);
}

// LoadWaterData
function LoadWaterData(checkfinished) {
    LoadDataByXHR("WaterData", waterDataUrl, dataMap, checkfinished);
}

// LoadDataByXHR
function LoadDataByXHR(name, url, dataMap, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == 4 && this.status == 200) {

            dataMap.set(name, JSON.parse(this.responseText));
            // dataMap.set(name, this.responseText);

            if (typeof callback === "function") {
                callback();
            }
        }
        else {
            console.log(`Http error code : ${this.status}`);
        }
    }
    xhr.open("GET", url);
    xhr.send();
}

// Init Google Map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: Taiwan,
        zoom: 8,
    });
}

function AddMarkerWithInfo(position, icon,title,infoContent) {


    let marker = new google.maps.Marker({
        // position : {lat:value , lng:value}
        position: position,
        map,
        title: title,
        icon: icon,
        animation: google.maps.Animation.DROP,
    });

    // create infoWindow
    let info = new google.maps.InfoWindow({ content: infoContent });

    //  add marker infowindow
    marker.addListener("click", function(){        
        console.log(this);
        MarkerClick(this,info);
    });

    // add marker click event
    // marker.addListener("click", toogleBounce);
    // function toogleBounce() {
    //     if (marker.getAnimation() !== null) {
    //         marker.setAnimation(null);
    //     }
    //     else {
    //         marker.setAnimation(google.maps.Animation.BOUNCE);
    //     }
    // }

    infos.push(info);
    markers.push(marker);
}
function MarkerClick(marker,infoWindow){
    ClearInfo();
    marker.map.center = marker.position,
    marker.map.zoom = 12;
    infoWindow.open(marker.map, marker);
}
function DeleteMarkers() {

    markers.forEach(item => {
        // google.maps.Marker.setMap(target)
        item.setMap(null);
    });
    markers = [];
    infos = [];


}

function ClearInfo() {
    infos.forEach((item) => {
        item.close();
    });
}


// main process
function Process() {
    let yearSelect = document.querySelector("#yearSelect");
    if (yearSelect.selectedIndex == 0) {
        alert("請選擇年份");
        return
    }

    DeleteMarkers();

    setTimeout(() => {
        let data = CreateData(yearSelect.value.toString());

        data.forEach((item, index) => {
            let indoConent = CreateInfoContent(item);

            setTimeout(() => {
                AddMarkerWithInfo(
                    { lat: item.Lat, lng: item.Lng },
                    iconPath + "water-48px.png",
                    `${item.City} ${item.District}`,
                    indoConent
                );
            }, 20 * index
            );
        });

    }, 100);
}

// CreateData By Year
function CreateData(year) {
    // let waterDataYear = waterData.filter(x => x.Year === year && x.County === "台北市");
    let waterDataYear = waterData.filter(x => x.Year === year);
    let DistrictIntersection = cityDistrict.filter((x) => waterDataYear.find(y => x.City == y.County && x.District == y.Town) !== undefined);

    return DistrictIntersection.map((citydistrict) => {
        return {
            City: citydistrict.City,
            District: citydistrict.District,
            Lat: citydistrict.Lat,
            Lng: citydistrict.Lng,
            ConsumptionOfwater: waterDataYear.filter((waterData) => waterData.County == citydistrict.City && waterData.Town == citydistrict.District)
                .sort((a, b) => a.Month - b.Month).map((item) => {
                    return {
                        Year: item.Year,
                        Month: item.Month,
                        TheDailyDomesticConsumptionOfWaterPerPerson: item.TheDailyDomesticConsumptionOfWaterPerPerson,
                    };
                })
        };
    });
}

// CreateInoContent
function CreateInfoContent(data){        
    let yearData;
    data.ConsumptionOfwater.forEach((water)=>{
        yearData = yearData || "";        
        yearData +=`
        <tr>
            <th scope="row">${water.Month}</th>
            <td>${water.TheDailyDomesticConsumptionOfWaterPerPerson}</td>
        </tr>
        `;        
    });
    
    return `
        <div class="text-center">
            <h2>${data.City} ${data.District} ${data.ConsumptionOfwater[0].Year}年度<span class="d-block">每人每日用水量<span></h2>
            <table class="table table-info table-striped">
                <thead>
                    <tr>
                        <th scope="col">月份</th>
                        <th scope="col">每人每日用水量</th>
                    </tr>
                </thead>
                <tbody>
                    ${yearData}
                </tbody>
            </table>
        </div>`;
}
