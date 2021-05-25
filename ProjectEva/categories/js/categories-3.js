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
        this.currentPOS = 0;
        this.pageHeight = pageHeight;
        this.itemsPerPage = itemsPerPage;
        this.parentDOM = null;
        this.listItemWrapDOM = null;
        this.navPrevDOM = null;
        this.navNextDOM = null;
    }

    // Initialize parts of scrollMenu        
    Initialize() {
        this.parentDOM = document.getElementById(this.parentIDName);
        this.listItemWrapDOM = this.parentDOM.querySelector(".menu-list-item-wrap");
        this.navPrevDOM = this.parentDOM.querySelector(".scroll-previous");
        this.navNextDOM = this.parentDOM.querySelector(".scroll-next");

        this.parentDOM.querySelector(".menu-list-wrap").style.height = this.pageHeight + "px";
        this.parentDOM.querySelectorAll(".menu-list-item").forEach(elm => elm.style.height = (this.pageHeight / this.itemsPerPage) + "px");
        this.navPrevDOM.addEventListener("click", () => this.ScrollingMenu(true));
        this.navNextDOM.addEventListener("click", () => this.ScrollingMenu(false));
        this.ScrollElementByPositionY(0);
        this.SetNavBtnStatus(this.navPrevDOM, false);
        this.SetNavBtnStatus(this.navNextDOM, true);


        // mousedrap
        this.listItemWrapDOM.addEventListener("mousedown", (e) => this.MouseDrag(e));
        // this.listItemWrapDOM.addEventListener("click", (e) => e.preventDefault());

        // this.parentDOM.querySelector(".menu-list-item-wrap").addEventListener("mousedown", this.MouseDrag);
        // this.parentDOM.querySelector(".menu-list-item-wrap").addEventListener("mousedown", function (e) { 
        //     console.log(e);
        //     console.log(this);
        //     this.MouseDrag(e);
        // });
        // this.parentDOM.querySelector(".menu-list-item-wrap").addEventListener("mousemove", this.MouseDrag);
    }

    MouseDrag(e) {
        // cancel default action
        e.preventDefault();
        // this.listItemWrapDOM.onclick = (e) => e.preventDefault();
        // console.log(this);
        console.log(e.pageY);
        console.log(e.target);
        let StartPointY = e.pageY;
        let isMove = false;
        document.onmousemove = (e1) => {
            // console.log(e1.target);
            // console.log(StartPointY);
            console.log(e1.pageY);
            this.listItemWrapDOM.style.top = (e1.pageY - StartPointY + this.currentPOS) + "px";

            if (!isMove && (e1.pageY - StartPointY) != 0) {
                console.log("reg");
                isMove = true;
                console.log(e.target);
                e.target.onclick = (e2) => {
                    console.log("hi");
                    e2.preventDefault()
                    e2.target.onclick = null;
                    console.log(e2.target);
                    console.log(e2);
                };
            }
        };
        document.onmouseup = (e1) => {
            if (e1.target != e.target) {
                e.target.onclick = null;
            }
            // console.log(e1);
            // console.log(e1.target);
            // console.log("doc");
            // console.log(e1.target);
            // console.dir(e1);
            // console.log(e.target);
            // console.dir(e);            

            document.onmouseup = null;
            document.onmousemove = null;
            // e.target.onclick = null;
        };
        // console.log(StartPointY);
        // e.target.onclick = (e1) => {
        //     e1.preventDefault()
        //     e1.target.onclick = null;
        //     console.log(e1.target);
        //     console.log(e1);
        // };
    }

    // menu-list-wrap
    // menu-list-item-wrap
    async ScrollingMenu(scrollDirection) {
        let destposition = 0, nextPOS = 0, scrolllimit = 0;
        let outOfRange = false;
        let menuHeight = this.listItemWrapDOM.getBoundingClientRect().height;
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
        let result = await this.ScrollElementByPositionY(destposition);
        // console.log(result);

        this.SetNavBtnStatus(this.navPrevDOM, this.currentPOS < upperLimit);
        this.SetNavBtnStatus(this.navNextDOM, this.currentPOS > lowerLimit);
    }

    SetNavBtnStatus(DOMElement, EnStatus) {
        if (EnStatus) {
            DOMElement.removeAttribute("disabled");
        } else {
            DOMElement.setAttribute("disabled", "");
        }
    }

    //implement Scroll Element effect
    ScrollElementByPositionY(destPosition, frame = 20, millSecondPerFrame = 15) {
        let elem = this.listItemWrapDOM;

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