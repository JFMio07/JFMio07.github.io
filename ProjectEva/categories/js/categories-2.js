window.onload = function () {
    // owl-carousel initialize
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

}

// Scroll Menu
class scrollMenu {
    constructor(IDName, pageHeight, itemsPerPage) {
        this.parentIDName = IDName;
        this.parentDOM = null;
        this.currentPOS = 0;
        this.pageHeight = pageHeight;
        this.itemsPerPage = itemsPerPage;
    }

    // Initialize parts of scrollMenu        
    Initialize() {
        this.parentDOM = document.getElementById(this.parentIDName);
        this.parentDOM.querySelector(".menu-list-wrap").style.height = this.pageHeight + "px";
        this.parentDOM.querySelectorAll(".menu-list-item").forEach(elm => elm.style.height = (this.pageHeight / this.itemsPerPage) + "px");
        this.parentDOM.querySelector(".scroll-previous").addEventListener("click", () => this.ScrollingMenu(true));
        this.parentDOM.querySelector(".scroll-next").addEventListener("click", () => this.ScrollingMenu(false));
        this.ScrollElementByPositionY(".menu-list-item-wrap",0);
        this.SetNavBtnStatus(".scroll-previous", false);
        this.SetNavBtnStatus(".scroll-next", true);
    }

    async ScrollingMenu(scrollDirection) {
        let destposition = 0, nextPOS = 0, scrolllimit = 0;
        let outOfRange = false;
        let menuHeight = this.parentDOM.querySelector(".menu-list-item-wrap").getBoundingClientRect().height;
        let upperLimit = 0;
        let lowerLimit = (menuHeight - this.pageHeight) * -1;
        if (scrollDirection) {
            // position of scroll up is positive
            // max of position of scroll up : 0
            scrolllimit = upperLimit;
            nextPOS = (this.currentPOS + this.pageHeight);
            outOfRange = nextPOS > scrolllimit ? true : false;
        } else {
            // position of scroll up is negative
            // max of position of scroll down : (menuHeight - this.pageHeight)
            scrolllimit = lowerLimit;
            nextPOS = (this.currentPOS - this.pageHeight);
            outOfRange = nextPOS < scrolllimit ? true : false;
        }

        destposition = outOfRange ? scrolllimit : nextPOS;
        this.currentPOS = destposition;
        let result = await this.ScrollElementByPositionY(".menu-list-item-wrap", destposition);
        // console.log(result);

        this.SetNavBtnStatus(".scroll-previous", this.currentPOS < upperLimit);
        this.SetNavBtnStatus(".scroll-next", this.currentPOS > lowerLimit);
    }

    SetNavBtnStatus(navBtnName, EnStatus) {
        if (EnStatus) {
            this.parentDOM.querySelector(navBtnName).removeAttribute("disabled");
        } else {
            this.parentDOM.querySelector(navBtnName).setAttribute("disabled", "");
        }
    }

    //implement Scroll Element effect
    ScrollElementByPositionY(menuClassName, destPosition, frame = 20, millSecondPerFrame = 15) {
        let elem = this.parentDOM.querySelector(menuClassName);

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

// class scrollMenu {
//     constructor(IDName, pageHeight, itemsPerPage) {
//         let parentIDName = IDName;
//         let parentDOM = null;
//         let currentPOS = 0;
//         this.pageHeight = pageHeight;
//         this.itemsPerPage = itemsPerPage;


//         // Initialize parts of scrollMenu
//         this.Initialize = function () {
//             parentDOM = document.getElementById(parentIDName);
//             parentDOM.querySelector(".menu-list-wrap").style.height = this.pageHeight + "px";
//             parentDOM.querySelectorAll(".menu-list-item").forEach(elm => elm.style.height = (this.pageHeight / this.itemsPerPage) + "px");
//             // parentDOM.querySelector(".scroll-previous").setAttribute("disabled", "");
//             parentDOM.querySelector(".scroll-previous").addEventListener("click", () => this.ScrollingMenu(true));
//             // parentDOM.querySelector(".scroll-next").removeAttribute("disabled");
//             parentDOM.querySelector(".scroll-next").addEventListener("click", () => this.ScrollingMenu(false));
//         }

//         this.ScrollingMenu = async function (scrollDirection) {
//             let destposition = 0;
//             let menuHeight = parentDOM.querySelector(".menu-list-item-wrap").getBoundingClientRect().height;
//             if (scrollDirection) {
//                 // position of scroll up is positive
//                 // max of position of scroll up : 0
//                 destposition = (currentPOS + this.pageHeight) > 0 ? 0 : (currentPOS + this.pageHeight);
//             } else {
//                 // position of scroll up is negative
//                 // max of position of scroll down : (menuHeight - this.pageHeight)
//                 destposition = (currentPOS - this.pageHeight) < (menuHeight - this.pageHeight) * -1 ? (menuHeight - this.pageHeight) * -1 : (currentPOS - this.pageHeight);
//             }
//             currentPOS = destposition;
//             let result = await this.ScrollElementByPositionY(this,parentDOM,".menu-list-item-wrap", destposition);
//             // console.log(result);

//         }
//     }
//     //
//     ScrollElementByPositionY(txt,parentDOM,menuClassName, destPosition, frame = 20, millSecondPerFrame = 15) {
//         console.log(txt);
//         let elem = parentDOM.querySelector(menuClassName);

//         if (elem == null || destPosition == null) { throw new Error("input parameter error."); }

//         elem.style.top = elem.style.top === "" ? "0px" : elem.style.top;
//         let startPosition = parseFloat(elem.style.top);
//         frame = frame > 0 ? frame : 1;

//         //scroll direction of Y-axis
//         //false : scroll down ;
//         //true : scroll up ; 
//         let scrollDirection = destPosition > startPosition;
//         let perScroll = (Math.abs(destPosition - startPosition) / frame);

//         return new Promise((resolve, reject) => {
//             if (perScroll !== 0) {
//                 for (let i = 0; i < frame; i++) {
//                     ((t) => {
//                         setTimeout(() => {
//                             let currentPos = parseFloat(elem.style.top);
//                             let currentdiff = Math.abs((destPosition - currentPos));
//                             let newPerScroll = currentdiff >= perScroll ? perScroll : currentdiff;
//                             newPerScroll *= (scrollDirection ? 1 : -1);

//                             elem.style.top = currentPos + newPerScroll + "px";

//                             // console.log(parseFloat(elem.style.top));

//                             if (parseFloat(elem.style.top) == destPosition) {
//                                 resolve("Scroll Completed");
//                             }
//                         }, t);
//                     })(millSecondPerFrame * i)
//                 }
//             }
//             else {
//                 resolve("Scroll Completed");
//             }
//         })
//     }
// }

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