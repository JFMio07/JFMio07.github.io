window.onload = function () {
    // owl-carousel 初始化
    $('.owl-carousel').owlCarousel({
        // loop:true,
        // autoplay:false,
        // autoplayTimeout:5000,
        // autoplayHoverPause:true,
        responsiveClass: true,
        margin: 6,
        nav: true,
        responsive: {
            0: {
                items: 2,
            },
            569: {
                items: 3
            },
            881: {
                items: 4
            },
            1000: {
                items: 5
            }

        }
    })

    let scrollMenuObj = new scrollMenu("scroll-menu", 280, 7);
    scrollMenuObj.Initialize();
    // console.log(scrollMenuObj.element);


}

class scrollMenu {
    constructor(IDName, pageHeight, itemsPerPage) {
        let parentIDName = IDName;
        let parentDOM = null;
        let currentPOS = 0;
        this.pageHeight = pageHeight;
        this.itemsPerPage = itemsPerPage;


        // Initialize parts of scrollMenu
        this.Initialize = function () {
            parentDOM = document.getElementById(parentIDName);
            parentDOM.querySelector(".menu-list-wrap").style.height = this.pageHeight + "px";
            parentDOM.querySelectorAll(".menu-list-item").forEach(elm => elm.style.height = (this.pageHeight / this.itemsPerPage) + "px");
            // parentDOM.querySelector(".scroll-previous").setAttribute("disabled", "");
            parentDOM.querySelector(".scroll-previous").addEventListener("click", () => this.ScrollingMenu(true));
            // parentDOM.querySelector(".scroll-next").removeAttribute("disabled");
            parentDOM.querySelector(".scroll-next").addEventListener("click", () => this.ScrollingMenu(false));
        }

        this.ScrollingMenu = async function (scrollDirection) {
            let destposition = 0;
            let outOfRange = false;
            let menuHeight = parentDOM.querySelector(".menu-list-item-wrap").getBoundingClientRect().height;
            console.log(menuHeight);
            if (scrollDirection) {
                destposition = currentPOS + this.pageHeight;
            } else {
                destposition = currentPOS - this.pageHeight;
            }

            if (destposition > 0 ||) {
                return
            }
            currentPOS = destposition;
            let result = await this.ScrollElementByPositionY(".menu-list-item-wrap", destposition);
            console.log(result);

            console.log(scrollDirection);
        }
    }

    //
    ScrollElementByPositionY(menuClassName, destPosition, frame = 20, millSecondPerFrame = 15) {
        let elem = document.querySelector(menuClassName);

        if (elem == null || destPosition == null) { throw new Error("input parameter error."); }

        elem.style.top = elem.style.top === "" ? "0px" : elem.style.top;
        let startPosition = parseFloat(elem.style.top);
        frame = frame > 0 ? frame : 1;

        //scroll direction of Y-axis
        //false : scroll down ;
        //true : scroll up ; 
        let scrollDirection = destPosition > startPosition;
        let perScroll = (Math.abs(destPosition - startPosition) / frame);

        return new Promise((resolve, reject) => {
            if (perScroll !== 0) {
                for (let i = 0; i < frame; i++) {
                    ((t) => {
                        setTimeout(() => {
                            let currentPos = parseFloat(elem.style.top);
                            let currentdiff = Math.abs((destPosition - currentPos));
                            let newPerScroll = currentdiff >= perScroll ? perScroll : currentdiff;
                            newPerScroll *= (scrollDirection ? 1 : -1);

                            elem.style.top = currentPos + newPerScroll + "px";

                            // console.log(parseFloat(elem.style.top));

                            if (parseFloat(elem.style.top) == destPosition) {
                                resolve("Scroll Completed");
                            }
                        }, t);
                    })(millSecondPerFrame * i)
                }
            }
            else {
                resolve("Scroll Completed");
            }
        })
    }

}

// function scrollMenu(IDName, pageHeight, itemOfPage) {
//     this.IDName = IDName;
//     this.pageHeight = pageHeight;
//     this.itemOfPage = itemOfPage;
//     let parentDOM = null;

//     this.Initialize = function () {
//         parentDOM = document.getElementById(this.IDName);
//         parentDOM.querySelector(".menu-list-wrap").style.height = this.pageHeight + "px";
//         parentDOM.querySelectorAll(".menu-list-item").forEach(elm => elm.style.height = (this.pageHeight / this.itemOfPage) + "px");
//         parentDOM.querySelector(".scroll-previous").setAttribute("disabled","");
//         parentDOM.querySelector(".scroll-next").removeAttribute("disabled");
//     }
// }


// function ScrollElementByPositionY(elementId, destPosition, frame = 20, millSecondPerFrame = 15) {
//     let elem = document.getElementById(elementId);

//     if (elem == null || destPosition == null) { throw new Error("input parameter error."); }

//     elem.style.top = elem.style.top === "" ? "0px" : elem.style.top;
//     let startPosition = parseFloat(elem.style.top);
//     frame = frame > 0 ? frame : 1;

//     //scroll direction of Y-axis
//     //false : scroll down ;
//     //true : scroll up ; 
//     let scrollDirection = destPosition > startPosition;
//     let perScroll = (Math.abs(destPosition - startPosition) / frame);

//     return new Promise((resolve, reject) => {
//         if (perScroll !== 0) {
//             for (let i = 0; i < frame; i++) {
//                 ((t) => {
//                     setTimeout(() => {
//                         let currentPos = parseFloat(elem.style.top);
//                         let currentdiff = Math.abs((destPosition - currentPos));
//                         let newPerScroll = currentdiff >= perScroll ? perScroll : currentdiff;
//                         newPerScroll *= (scrollDirection ? 1 : -1);

//                         elem.style.top = currentPos + newPerScroll + "px";

//                         // console.log(parseFloat(elem.style.top));

//                         if (parseFloat(elem.style.top) == destPosition) {
//                             resolve("Scroll Completed");
//                         }
//                     }, t);
//                 })(millSecondPerFrame * i)
//             }
//         }
//         else {
//             resolve("Scroll Completed");
//         }
//     })
// }