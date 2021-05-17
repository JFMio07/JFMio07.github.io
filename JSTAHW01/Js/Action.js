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
  pdPic.innerHTML = "";
}

function CreateTypeContent(type) {
  let selProducts = products.filter((product) => product.type == type);


  CreatePDTitle(selProducts[0]);
  CreatePDModel(selProducts);
  CreatePDColor(selProducts[0]);
  CreatePDStorage(selProducts[0]);


  // pic area
  let typepic = document.createElement("img");
  // imgfoler/typefolder/namefolder.imgFileName.extenssion
  let picUrl = `${BuildPDFolderPath(
    type,
    selProducts[0].pdInfo
  )}/${BuildPdFullName(type, selProducts[0].pdInfo, "-")}${imgExtension}`;
  typepic.setAttribute("src", picUrl);
  typepic.classList.add("w-100");
  pdPic.appendChild(typepic);
}

function CreatePDTitle(selProduct) {
  // choice Product : title
  let title = document.createElement("h2");
  title.innerHTML = `<span>全新</span>`;
  title.appendChild(
    document.createTextNode(`購買 ${selProduct.pdInfo.catelog}`)
  );
  title.classList.add("buy-title");
  pdAction.appendChild(title);

}



function CreatePDModel(selProducts) {
  // choice Product : model
  let model = document.createElement("div");
  model.classList.add("model");
  model.innerHTML = `<p>
                            <span>選擇機型。</span>
                        </p>`;
  selProducts.forEach((item, index) => {
    model.insertAdjacentHTML(
      "beforeend",
      template_choiceModel("choiceModel", `model${index}`)
    );
    let choiceModel = model.querySelectorAll(".choiceModel")[index];
    choiceModel.querySelector(
      ".choiceModel-label-name>:nth-child(1)"
    ).textContent = BuildPdFullName(item.type, item.pdInfo, " ");
    choiceModel.querySelector(".choiceModel-label-price").textContent = "NT$" +
      item.specInfo.sellPrice.sort((a, b) => { a.price - b.price; }).find((x) => x).price + "起";

    choiceModel.querySelector(".selector").addEventListener("click", (e) => {
      console.log(e);
    });
  });
  pdAction.appendChild(model);

}


function CreatePDColor(selProduct) {
  // choice Product : color
  let color = document.createElement("div");
  color.classList.add("color");
  color.innerHTML = `<p>
                          <span>選擇外觀。</span>
                      </p>`;
  let wrap = document.createElement("div");
  wrap.classList.add("wrap");
  selProduct.specInfo.colorInfo.forEach((info, index) => {
    wrap.insertAdjacentHTML(
      "beforeend",
      template_choiceColor("choiceColor", `Color${index}`)
    );

    let choiceColor = wrap.querySelectorAll(".choiceColor")[index];
    let choiceColorImg = choiceColor.querySelector(".choiceColor-label .pic img");
    choiceColorImg.setAttribute("src", `${BuildPDFolderPath(selProduct.type, selProduct.pdInfo)}/${info.btnImg}`);
    choiceColorImg.setAttribute("alt", info.pdColor);
    let choiceColorCaption = choiceColor.querySelector(".choiceColor-label figcaption");
    choiceColorCaption.textContent = info.pdColor;

    choiceColor.querySelector(".selector").addEventListener("click", (e) => {
      console.log(e);
    });
  });
  color.appendChild(wrap);
  pdAction.appendChild(color);

}
function CreatePDStorage(selProduct) {
  // choice Product : Storage
  let storage = document.createElement("div");
  storage.classList.add("storage");
  storage.innerHTML = `<p>
                          <span>選擇儲存容量。</span>
                      </p>`;
  let wrap = document.createElement("div");
  wrap.classList.add("wrap");

  selProduct.specInfo.sellPrice.forEach((info, index) => {
    wrap.insertAdjacentHTML(
      "beforeend",
      template_choiceStorage("choiceStorage", `Storage${index}`)
    );

    let choiceStorage = wrap.querySelectorAll(".choiceStorage")[index];

    let unitIndex = info.storage.indexOf("GB");
    choiceStorage.querySelector(
      ".choiceStorage-label>.size :nth-child(1)"
    ).textContent = info.storage.substring(0,unitIndex);

    choiceStorage.querySelector(
      ".choiceStorage-label>.size :nth-child(2)"
    ).textContent = info.storage.substring(unitIndex);

    choiceStorage.querySelector(".choiceStorage-label>.price").textContent = `NT$${info.price}`;

    choiceStorage.querySelector(".selector").addEventListener("click", (e) => {
      console.log(e);
    });
  });
  storage.appendChild(wrap);
  pdAction.appendChild(storage);

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

// template string

function template_choiceModel(name, id) {
  return `<div class="choiceModel form-check mb-3 ">
            <input class="selector form-check-input" type="radio" name=${name} id=${id}>
            <label class="selector-label choiceModel-label form-check-label px-3 py-3" for=${id}>
              <span class="choiceModel-label-name">
                <span></span>
                <span></span>
              </span>
              <span class="choiceModel-label-price">
              </span>
            </label>
          </div>`;
}


function template_choiceColor(name, id) {
  return `<div class="choiceColor form-check mb-3 ">
            <input class="selector form-check-input" type="radio" name=${name} id=${id}>
            <label class="selector-label choiceColor-label form-check-label px-3 py-3" for=${id}>
              <figure>
                <div class="pic">
                  <img src="" alt="">
                </div>        
                <figcaption></figcaption>
              </figure>
            </label>
          </div>`;
}

function template_choiceStorage(name, id) {
  return `<div class="choiceStorage form-check mb-3 ">
            <input class="selector form-check-input" type="radio" name=${name} id=${id}>
            <label class="selector-label choiceStorage-label form-check-label px-3 py-3" for=${id}>
              <div class="size">
              <span></span>
              <span></span>
              </div>
              <span class="price"></span>
            </label>
          </div>`;
}
