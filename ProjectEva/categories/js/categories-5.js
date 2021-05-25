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
        this.maxDragRange = null;
        this.parentDOM = null;
        this.listItemWrapDOM = null;
        this.navPrevDOM = null;
        this.navNextDOM = null;

        this.startPointY = null;
        this.isMove = false;
    }

    // Initialize parts of scrollMenu        
    Initialize() {
        this.parentDOM = document.getElementById(this.parentIDName);
        this.listItemWrapDOM = this.parentDOM.querySelector(".menu-list-item-wrap");
        this.navPrevDOM = this.parentDOM.querySelector(".scroll-previous");
        this.navNextDOM = this.parentDOM.querySelector(".scroll-next");
        this.maxDragRange = Math.ceil(this.pageHeight / 20);

        this.parentDOM.querySelector(".menu-list-wrap").style.height = this.pageHeight + "px";
        this.parentDOM.querySelectorAll(".menu-list-item").forEach(elm => elm.style.height = (this.pageHeight / this.itemsPerPage) + "px");
        this.navPrevDOM.addEventListener("click", () => this.ScrollingMenuContext(this.GetNextPagePos(true)));
        this.navNextDOM.addEventListener("click", () => this.ScrollingMenuContext(this.GetNextPagePos(false)));
        this.ScrollingMenuContext(0);

        // mousedrap
        this.listItemWrapDOM.addEventListener("mousedown", (e) => this.MouseDrag(e));

        // touchstart
        this.listItemWrapDOM.addEventListener("touchstart", (e) => this.TouchStart(e));

    }

    TouchStart(e) {
        // get first touch point
        this.startPointY = e.changedTouches[0].pageY;

        let TouchMove = (e1) => {
            // console.log("TouchMove");            

            // cancel scroll default action
            e1.preventDefault();

            let currentPointY = e1.changedTouches[0].pageY;
            let moveRange = this.CoerceDraggingRange(Math.ceil(currentPointY - this.startPointY));

            this.listItemWrapDOM.style.top = moveRange + this.currentPOS + "px";
        }

        let TouchEnd = (e1) => {
            // console.log("TouchEnd");            

            let currentPointY = e1.changedTouches[0].pageY;
            let moveRange = currentPointY - this.startPointY;

            this.DraggingAction(moveRange);         

            //this document event is only for TouchDrag
            this.listItemWrapDOM.removeEventListener("touchmove", TouchMove);
            this.listItemWrapDOM.removeEventListener("touchend", TouchEnd);
        }

        this.listItemWrapDOM.addEventListener("touchmove", TouchMove);
        this.listItemWrapDOM.addEventListener("touchend", TouchEnd);
    }



    MouseDrag(e) {
        // cancel drag default action
        e.preventDefault();

        this.startPointY = e.pageY;
        this.isMove = false;

        let Click = (e1) => {
            // console.log("click");
            e1.preventDefault()
            //clear preventDefault event
            this.listItemWrapDOM.removeEventListener("click", Click);
        };

        let MouseMove = (e1) => {
            // console.log("mousemove");
            // console.log(e1.target);
            let currentPointY = e1.pageY;
            let moveRange = this.CoerceDraggingRange(Math.ceil(currentPointY - this.startPointY));
        
            this.listItemWrapDOM.style.top = moveRange + this.currentPOS + "px";

            // cancel dclick efault action if moved
            if (!this.isMove && moveRange != 0) {
                // console.log("reg");
                this.isMove = true;

                this.listItemWrapDOM.addEventListener("click", Click);
            }
        };

        let MouseUp = (e1) => {
            // console.log("mouseup");
            let currentPointY = e1.pageY;
            let moveRange = currentPointY - this.startPointY;

            this.DraggingAction(moveRange);            
            if (this.isMove && e.target != e1.target) {
                // console.log("removeclick");
                this.listItemWrapDOM.removeEventListener("click", Click);
            }
            //this document event is only for MouseDrag
            document.removeEventListener("mousemove", MouseMove);
            document.removeEventListener("mouseup", MouseUp);
        };

        document.addEventListener("mousemove", MouseMove);
        document.addEventListener("mouseup", MouseUp);
    }

    DraggingAction(moveRange) {
        // if move Range of dragging is over maxDragRange > next page
        // if move Range of dragging is not over maxDragRange > keeping page
        if (Math.abs(moveRange) > this.maxDragRange) {
            this.ScrollingMenuContext(this.GetNextPagePos((moveRange > 0) ? true : false));
        }
        else {
            this.ScrollingMenuContext(this.currentPOS);
        }
    }

    CoerceDraggingRange(moveRange) {
        if (Math.abs(moveRange) > this.maxDragRange) {
            moveRange = this.maxDragRange * (moveRange > 0 ? 1 : -1);
        }
        return moveRange;
    }

    GetNextPagePos(scrollDirection) {
        let nextPosition = 0;

        if (scrollDirection) {
            nextPosition = (this.currentPOS + this.pageHeight);
        } else {
            nextPosition = (this.currentPOS - this.pageHeight);
        }
        return nextPosition;
    }


    ScrollingMenuContext(destPosition) {
        let menuHeight = this.listItemWrapDOM.getBoundingClientRect().height;
        // position of scroll up is positive
        // max of position of scroll up : 0
        let upperLimit = 0;
        // position of scroll up is negative
        // max of position of scroll down : (menuHeight - this.pageHeight)
        let lowerLimit = (menuHeight - this.pageHeight) * -1;

        this.ScrollingMenu(destPosition, upperLimit, lowerLimit);
    }

    CoerceRangeScrollPosY(positionY, upperLimit, lowerLimit) {
        // return valid of destination of position
        if (positionY > upperLimit) { return upperLimit; }
        if (positionY < lowerLimit) { return lowerLimit; }
        return positionY;
    }

    async ScrollingMenu(positionY, upperLimit, lowerLimit) {
        let destposition = 0;
        destposition = this.CoerceRangeScrollPosY(positionY, upperLimit, lowerLimit);

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