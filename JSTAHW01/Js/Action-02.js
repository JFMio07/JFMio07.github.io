import { $g } from "./helpers.js";

const imgFolder = "./images";
const imgExtension = ".png";
let pdAction = $g("#pd-action");
let pdPic = $g("#pd-pic");

// function productInfo(type,pdInfo){
//   this.name
// }

// 產品資料
let products = [
  {
    type: "iPhone",
    pdInfo: {
      catelog: "iPhone 12",
      ver: "12",
      series: "mini",
    },
    specInfo: {
      colorInfo: [
        {
          pdColor: "white",
          btnImg: "btn-white.png",
        },
        {
          pdColor: "black",
          btnImg: "btn-black.png",
        },
        {
          pdColor: "blue",
          btnImg: "btn-blue.png",
        },
        {
          pdColor: "green",
          btnImg: "btn-green.png",
        },
        {
          pdColor: "red",
          btnImg: "btn-red.png",
        },
      ],
      sellPrice: [
        { storage: "64GB", price: 23900 },
        { storage: "128GB", price: 25500 },
        { storage: "256GB", price: 29000 },
      ],
    },
  },
  {
    type: "iPhone",
    pdInfo: {
      catelog: "iPhone 12",
      ver: "12",
      series: "",
    },
    specInfo: {
      colorInfo: [
        {
          pdColor: "white",
          btnImg: "btn-white.png",
        },
        {
          pdColor: "black",
          btnImg: "btn-black.png",
        },
        {
          pdColor: "blue",
          btnImg: "btn-blue.png",
        },
        {
          pdColor: "green",
          btnImg: "btn-green.png",
        },
        {
          pdColor: "red",
          btnImg: "btn-red.png",
        },
      ],
      sellPrice: [
        { storage: "64GB", price: 26900 },
        { storage: "128GB", price: 28500 },
        { storage: "256GB", price: 32000 },
      ],
    },
  },
  {
    type: "iPad",
    pdInfo: {
      catelog: "iPad",
      series: "",
    },
    specInfo: {
      colorInfo: [
        {
          pdColor: "spacegray",
        },
        {
          pdColor: "silver",
        },
        {
          pdColor: "gold",
        },
      ],
      sellPrice: [
        {
          storage: "32GB",
          net: "wifi",
          price: 10500,
        },
        {
          storage: "32GB",
          net: "wifi",
          price: 14800,
        },
        {
          storage: "128GB",
          net: "cell",
          price: 13500,
        },
        {
          storage: "128GB",
          net: "cell",
          price: 17800,
        },
      ],
    },
  },
];

window.onload = function () {
  let btnIphone = document.getElementById("btn-iphone");
  btnIphone.addEventListener("click", ShowIphoneData);

  let btnIpad = document.getElementById("btn-ipad");
  btnIpad.addEventListener("click", ShowIpadData);
};

function ShowIphoneData() {
  EraseContent();
  CreateTypeContent("iPhone");
}

function ShowIpadData() {
  EraseContent();
  CreateTypeContent("iPad");
}

function EraseContent() {
  pdAction.innerHTML = "";
  pdPic.querySelector("img").src="";
  pdPic.querySelector("img").alt="";
}

function CreateTypeContent(type) {
  let selProducts = products.filter((product) => product.type == type);

  switch (type) {
    case "iPhone":
      CreatePDTitle(selProducts[0]);
      CreatePDModel(selProducts);
      CreatePDColor(selProducts[0]);
      CreatePDStorage(selProducts[0]);
      break;
    case "iPad":
      CreatePDTitle(selProducts[0]);
      CreatePDColor(selProducts[0]);
      CreatePDStorage(selProducts[0]);
      // CreatePDNetwork(selProducts[0]);
      // CreatePDMarker(selProducts[0]);
      break;

  }

  // pic area
  let typepic = pdPic.querySelector("img");
  // imgfoler/typefolder/namefolder.imgFileName.extenssion
  let picUrl = `${BuildPDFolderPath(type, selProducts[0].pdInfo)}/${BuildPdFullName(type, selProducts[0].pdInfo, "-")}${imgExtension}`;
  typepic.src=picUrl
}

function CreatePDTitle(selProduct) {
  // choice Product : title
  let cloneContent = $g("#tpl-buyTitle").content.cloneNode(true);
  cloneContent.querySelector("span").innerText = "全新";
  cloneContent.appendChild(document.createTextNode(`購買 ${selProduct.pdInfo.catelog}`));
  pdAction.appendChild(cloneContent);
}



function CreatePDModel(selProducts) {
  // choice Product : model

  let tplModalClone = $g("#tpl-choiceModel").content.cloneNode(true);
  let model = tplModalClone.querySelector(".model");
  model.querySelector("span").innerText = "選擇機型。";

  selProducts.forEach((item, index) => {

    let cloneContent = tplModalClone.querySelector("#tpl-choiceModel-selector").content.cloneNode(true);
    cloneContent.querySelector(".choiceModel-label-name>:first-child").textContent = BuildPdFullName(item.type, item.pdInfo, " ");
    cloneContent.querySelector(".choiceModel-label-name>:last-child").textContent = BuildPdFullName(item.type, item.pdInfo, " ");
    cloneContent.querySelector(".choiceModel-label-price").textContent = "NT$" +
      item.specInfo.sellPrice.sort((a, b) => { a.price - b.price; }).find((x) => x).price + "起";
    cloneContent.querySelector(".selector").setAttribute("id", `model${index}`);
    cloneContent.querySelector(".selector-label").setAttribute("for", `model${index}`);
    // cloneContent.querySelector(".selector").addEventListener("click", (e) => {
    //   console.log(e.target.parentNode.parentNode.nextElementSibling);
    // });
    cloneContent.querySelector(".selector").addEventListener("click", (e) => {
      let picUrl = `${BuildPDFolderPath(item.type, item.pdInfo)}/${BuildPdFullName(item.type, item.pdInfo, "-")}${imgExtension}`;
      pdPic.querySelector("img").src=``;

      console.log(e.target.parentNode.parentNode.nextElementSibling);
    });

    model.appendChild(cloneContent);
  });
  pdAction.appendChild(tplModalClone);

}


function CreatePDColor(selProduct) {
  // choice Product : color

  let tplColorClone = $g("#tpl-choiceColor").content.cloneNode(true);
  let color = tplColorClone.querySelector(".color");
  color.classList.add("disabled");
  color.querySelector("span").innerText = "選擇外觀。";

  let wrap = color.querySelector(".wrap");

  selProduct.specInfo.colorInfo.forEach((info, index) => {
    let cloneContent = tplColorClone.querySelector("#tpl-choiceColor-selector").content.cloneNode(true);

    let choiceColorImg = cloneContent.querySelector(".choiceColor-label .pic img");
    choiceColorImg.setAttribute("src", `${BuildPDFolderPath(selProduct.type, selProduct.pdInfo)}/${info.btnImg}`);
    choiceColorImg.setAttribute("alt", info.pdColor);
    let choiceColorCaption = cloneContent.querySelector(".choiceColor-label figcaption");
    choiceColorCaption.textContent = info.pdColor;

    cloneContent.querySelector(".selector").setAttribute("id", `color${index}`);
    cloneContent.querySelector(".selector").setAttribute("id", `color${index}`);
    cloneContent.querySelector(".selector-label").setAttribute("for", `color${index}`);
    cloneContent.querySelector(".selector").addEventListener("click", (e) => {
      console.log(e.target);
    });

    wrap.appendChild(cloneContent);
  });
  pdAction.appendChild(tplColorClone);

}
function CreatePDStorage(selProduct) {
  // choice Product : Storage

  let tplChoiceStorage = $g("#tpl-choiceStorage").content.cloneNode(true);
  let storage = tplChoiceStorage.querySelector(".storage");
  storage.classList.add("disabled");
  storage.querySelector("span").innerText = "選擇儲存容量。";

  let wrap = storage.querySelector(".wrap");

  selProduct.specInfo.sellPrice.forEach((info, index) => {

    let cloneContent = tplChoiceStorage.querySelector("#tpl-choiceStorage-selector").content.cloneNode(true);


    let unitIndex = info.storage.indexOf("GB");
    cloneContent.querySelector(
      ".choiceStorage-label>.size :first-child"
    ).textContent = info.storage.substring(0, unitIndex);

    cloneContent.querySelector(
      ".choiceStorage-label>.size :last-child"
    ).textContent = info.storage.substring(unitIndex);

    cloneContent.querySelector(".choiceStorage-label>.price").textContent = `NT$${info.price}`;

    cloneContent.querySelector(".selector").setAttribute("id", `storage${index}`);
    cloneContent.querySelector(".selector").setAttribute("id", `storage${index}`);
    cloneContent.querySelector(".selector-label").setAttribute("for", `storage${index}`);
    cloneContent.querySelector(".selector").addEventListener("click", (e) => {
      console.log(e);
    });

    cloneContent.querySelector(".selector").addEventListener("click", (e) => {
      console.log(e);
    });


    wrap.appendChild(cloneContent);
  });
  pdAction.appendChild(tplChoiceStorage);

}






function CreatePDDetail(type, pdInfo) { }

function BuildPDFolderPath(type, pdInfo) {
  return `${imgFolder}/${type}/${BuildPdFullName(type, pdInfo, "-")}`;
}

function BuildPdFullName(type, pdInfo, delimter) {
  let tmp = [
    type,
    pdInfo.hasOwnProperty("ver") ? pdInfo.ver : "",
    pdInfo.hasOwnProperty("series") ? pdInfo.series : "",
  ];
  return tmp.filter((x) => x !== "").join(delimter);

  // let ver = pdInfo.hasOwnProperty("ver") ? pdInfo.ver : "";
  // ver = ver.length == 0 ? "" : ` ${ver}`;
  // let series = pdInfo.series;
  // series = series.length == 0 ? "" : ` ${series}`;
  // return `${type}${ver}${series}`;
}

