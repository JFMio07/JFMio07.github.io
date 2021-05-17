function $g(selector) {
  // 判斷是否為id selector
  if (selector.includes("#") && !selector.includes(" ")) {
    //回傳Element
    return document.querySelector(selector);
  }

  //回傳NodeList集合
  let nodelist = document.querySelectorAll(selector);

  return nodelist.length == 1 ? nodelist[0] : nodelist;
}

// 產生DOM物件，並依據text填入該物件的innertText
function $c(element, text) {
  let el = document.createElement(element);

  //   判斷text不能為null、undefined，且length > 0
  if (text !== null && text !== undefined && text.length > 0) {
    el.innerText = text;
  }

  return el;
}

function $genUI(liArray) {
  let ul = document.createElement("ul");

  liArray.forEach((item, index) => {
    let li = document.createElement("li");
    li.innerHTML = item;
    ul.appendChild(li);
  });
  return ul;
}

function $getRandom(min, max) {
  return Math.floor(Math.random() * max + min);
}

export { $g, $genUI, $getRandom, $c };
