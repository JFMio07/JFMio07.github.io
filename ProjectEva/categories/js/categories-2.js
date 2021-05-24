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
    // let scrollMenuObj = new scrollMenu("scroll-menu", 280, 3);
    scrollMenuObj.Initialize();
    // console.log(scrollMenuObj.element);


}

class scrollMenu {
    constructor(IDName, pageHeight, itemOfPage) {
        this.IDName = IDName;
        this.pageHeight = pageHeight;
        this.itemOfPage = itemOfPage;
        let parentDOM = null;

        this.Initialize = function () {
            parentDOM = document.getElementById(this.IDName);
            parentDOM.querySelector(".menu-list-wrap").style.height = this.pageHeight + "px";
            parentDOM.querySelectorAll(".menu-list-item").forEach(elm => elm.style.height = (this.pageHeight / this.itemOfPage) + "px");

            // console.log(parentDOM.querySelector(".menu-list-wrap"));
            // console.log(parentDOM);
        }
    }

}