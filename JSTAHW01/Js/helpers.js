function $g(value) {
  if (value.includes("#")) {
    return document.querySelector(value);
  } else {
    let nodeList = document.querySelectorAll(value);
    return nodeList.length == 1 ? nodeList[0] : nodeList;
  }
}


export { $g };
