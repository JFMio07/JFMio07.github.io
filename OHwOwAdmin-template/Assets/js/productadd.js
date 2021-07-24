let app = new Vue({
    el: "#productlist",
    data() {
        return {
            items: [],
            fields: [
                { key: 'productId', label: '商品編號', sortable: true, sortDirection: 'desc' },
                {
                    key: 'productName',
                    label: '商品名稱',
                    formatter: (value, key, item) => {
                        return StringContentFormat(value, 10);
                    },
                    sortable: false,
                    sortDirection: 'desc'
                },
                { key: 'productImg', label: '商品圖片' },
                {
                    key: 'authorName',
                    label: '作者',
                    formatter: (value, key, item) => {
                        return StringContentFormat(value, 10);
                    },
                    sortable: false,
                    sortDirection: 'desc'
                },
                {
                    key: 'publisherName',
                    label: '出版社',
                    formatter: (value, key, item) => {
                        return StringContentFormat(value, 10);
                    },
                    sortable: true,
                    sortDirection: 'desc'
                },
                {
                    key: 'mainCategory',
                    label: '主分類',
                    formatter: (value, key, item) => {
                        return StringContentFormat(value, 10);
                    },
                    sortable: true,
                    sortDirection: 'desc'
                },
                {
                    key: 'fixedPrice',
                    label: '單價',
                    formatter: (value, key, item) => {
                        return 'NT$' + CurrencyFormat(value);
                    },
                    sortable: true,
                    sortDirection: 'desc'
                },
                {
                    key: 'date',
                    label: '',
                    formatter: (value, key, item) => {
                        if (value == null) { return "" }
                        return DateFormat(value)
                    },
                    sortable: true,
                    sortByFormatted: true,
                    filterByFormatted: true
                },
                { key: 'actions', label: '商品管理' }
            ],
            currentitem: null,
            tabIndex: 0,
            totalRows: 1,
            currentPage: 1,
            perPage: 5,
            pageOptions: [5, 10, 15],
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],
            productDetailsModel: {
                id: 'product-details-modal',
                title: '',
                fields: [
                    { key: 'imagePath', title: '商品圖片', value: '' },
                    { key: 'productName', title: '商品名稱', value: '' },
                    { key: 'authorName', title: '作者', value: '' },
                    { key: 'publisherName', title: '出版社', value: '' },
                    { key: 'categoryName', title: '分類', value: '' },
                    { key: 'seriesName', title: '系列作', value: '' },
                    { key: 'language', title: '語言', value: '' },
                    { key: 'isbn', title: 'ISBN', value: '' },
                    { key: 'fixedPrice', title: '定價', value: '' },
                    { key: 'description', title: '簡介', value: '' },
                ]
            },

            //描述頁面是否忙碌中，EX:進行非同步作業
            isOnSaleBusy: { PageBusy: false, DetailsBusy: false },
            isNonSaleBusy: { PageBusy: false, DetailsBusy: false },

            //url列表
            //for live server
            urllist: {
                simplifyproductsOnSale: 'https://localhost:5001/api/Product/GetSimplifyProductsOnSale',
                simplifyproductsNonSale: 'https://localhost:5001/api/Product/GetSimplifyProductsNonSale',
                productDetails: 'https://localhost:5001/api/Product/GetProductDetails',
                UpdateProductSalesStatus: 'https://localhost:5001/api/Product/UpdateProductSalesStatus',
            },

            //商品精簡清單圖片延遲載入的參數
            simplifyproductimgProps: {
                blank: true,
                blankColor: '#bbb',
                height: 60
            },

            //商品圖片延遲載入的參數
            productimgProps: {
                blank: true,
                blankColor: '#bbb',
                width: 240,
                height: 340
            },

            //商品上下架MessageBox參數
            SalesConfirmBoxProps: {
                onSale: { message: '請再次確認是否要上架商品', data: { SaleStatus: true } },
                nonSale: { message: '請再次確認是否要下架商品', data: { SaleStatus: false } }
            },

            //麵包屑
            breadCrumbItems: [
                {
                    text: '首頁',
                    href: '/Home/Index'
                },
                {
                    text: '商品列表',
                    href: '/Product/Index'
                },
                {
                    text: '商品新增',
                    active: true
                }
            ],
            quill: ''


        }
    },
    computed: {

    },
    watch: {
        items: function () {
            this.totalRows = this.items.length
        },
        // tabIndex: function () {
        //     switch (this.tabIndex) {
        //         case 0:
        //             this.OnSalePage();
        //             break;
        //         case 1:
        //             this.NonSalePage();
        //             break;
        //         default:
        //             break;
        //     }
        // }
    },
    created() {
        //初始化頁面
        this.tabIndex = 1;
        // this.OnSalePage();
        this.quill = GetQuillInstance('#description-editor');


        quill.on('text-change', function (delta, oldDelta, source) {
            if (source == 'api') {
                console.log("An API call triggered this change.");
            } else if (source == 'user') {
                console.log("A user action triggered this change.");
            }
        });

    },
    mounted() {

    },
    methods: {
        //設定頁面預設狀態
        SetPageDefault() {
            this.items = [];
            this.totalRows = 1;
            this.currentPage = 1;
            this.perPage = 5;
            this.sortBy = '';
            this.sortDesc = false;
            this.filter = null;
        },
        //切換上架商品頁
        OnSalePage() {
            // console.log('onsalepage');
            this.SetPageDefault();
            this.fields.filter(x => x.key == 'date')[0].label = '上架日期';
            this.getSimplifyProducts(this.urllist.simplifyproductsOnSale, this.isOnSaleBusy);
        },
        //切換下架商品頁
        NonSalePage() {
            // console.log('Nonsalepage');
            this.SetPageDefault();
            this.fields.filter(x => x.key == 'date')[0].label = '下架日期';
            this.getSimplifyProducts(this.urllist.simplifyproductsNonSale, this.isNonSaleBusy);
        },
        //將API回傳的商品簡化版清單的格式轉成Vue物件所需的格式
        SimplifyProductDataProc(raw) {
            return raw.map((item, index) => {
                return {
                    productId: item.productID,
                    productName: item.productName,
                    // productImg: item.imagePath,
                    productImg: './Assets/image/book-sm-pic.jpg',
                    authorName: item.authorName,
                    publisherName: item.publisherName,
                    mainCategory: item.mainCategoryName,
                    subCategory: item.subCategoryName,
                    fixedPrice: item.fixedPrice,
                    date: item.shelfDate
                }
            });
        },
        //取得商品簡化版清單
        getSimplifyProducts(uri, busyobj) {
            busyobj.PageBusy = true;
            let cfg = {
                method: 'get',
                headers: { 'Content-type': 'application/json' },
                url: uri
            };
            axios(cfg)
                .then(res => {
                    if (Array.isArray(res.data.result) && res.status == 200) {

                        switch (res.data.status) {
                            case 0:
                                this.items = this.SimplifyProductDataProc(res.data.result);
                                break;
                            default:
                                console.log(res);
                                break;
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    busyobj.PageBusy = false;
                });
        },
        //取得商品明細
        getProductDetails(uri, id) {
            let cfg = {
                method: 'get',
                headers: { 'Content-type': 'application/json' },
                url: `${uri}/${id}`
            };

            return axios(cfg);
        },
        //更新商品銷售狀態
        UpdateProductSalesStatus(uri, data) {
            let cfg = {
                method: 'put',
                headers: { 'Content-type': 'application/json' },
                data: {
                    ID: data.ID,
                    SaleStatus: data.SaleStatus
                },
                url: uri
            };
            let successMsg = data.SaleStatus ? '已成功將商品上架' : '已成功將商品下架';
            let errorMsg = data.SaleStatus ? '商品上架請求失敗' : '商品下架請求失敗';

            axios(cfg)
                .then(res => {
                    if (res.status == 200) {
                        switch (res.data.status) {
                            case 0:
                                let index = this.items.findIndex(x => x.productId === data.ID)
                                if (index >= 0) {
                                    this.$bvToast.toast(successMsg, {
                                        title: `商品操作成功`,
                                        variant: "success",
                                        autoHideDelay: 1200,
                                        appendToast: true
                                    });
                                    this.items.splice(index, 1);
                                }
                                break;
                            default:
                                console.log(res);
                                this.$bvToast.toast(errorMsg, {
                                    title: `商品操作失敗`,
                                    variant: "danger",
                                    autoHideDelay: 1200,
                                    appendToast: true
                                });
                                break;
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.$bvToast.toast(errorMsg, {
                        title: `商品操作失敗`,
                        variant: "danger",
                        autoHideDelay: 1200,
                        appendToast: true
                    });
                })
                .finally(() => {
                });
        },
        //顯示商品明細
        async info(item, index, button) {
            try {
                this.isOnSaleBusy.DetailsBusy = true;

                this.productDetailsModel.title = `商品明細 - ID：${item.productId}`
                this.$root.$emit('bv::show::modal', this.productDetailsModel.id, button);
                let response = await this.getProductDetails(this.urllist.productDetails, item.productId);

                if (response.status == 200) {
                    let data = response.data.result;
                    //for live server
                    data.imagePath = './Assets/image/book-xl-pic.jpg';

                    //針對某些特定的key進行資料處理
                    for (let item of this.productDetailsModel.fields) {
                        if (item.key === 'categoryName') {
                            item.value = `${data['mainCategoryName']} - ${data['subCategoryName']}`;
                            continue;
                        }

                        if (item.key === 'fixedPrice') {
                            item.value = `NT$${CurrencyFormat(data[item.key])}`;
                            continue;
                        }
                        let tmp = data[`${item.key}`];
                        item.value = (tmp != '') ? tmp : '無';
                    }
                }
            } catch (err) {
                console.log(err);
            } finally {
                this.isOnSaleBusy.DetailsBusy = false;
            }
        },
        resetProductDetailsModel() {
            this.productDetailsModel.title = ''
            this.productDetailsModel.fields.map(x => x.value = '');
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        //顯示上下架確認視窗
        ShowUpdateSaleConfirm(productId, cfg) {
            this.$bvModal.msgBoxConfirm(cfg.message, {
                title: '操作確認',
                size: 'md',
                buttonSize: 'md',
                okVariant: 'warning ',
                okTitle: '確認',
                cancelTitle: '取消',
                footerClass: 'p-2',
                hideHeaderClose: true,
                centered: true,
                noCloseOnEsc: true,
                noCloseOnBackdrop: true
            })
                .then(value => {
                    if (value) {
                        let data = {
                            ID: productId,
                            SaleStatus: cfg.data.SaleStatus,
                        }
                        this.UpdateProductSalesStatus(this.urllist.UpdateProductSalesStatus, data)
                    }
                })
                .catch(err => {
                    // An error occurred
                })
        }
    }
});




window.onload = function () {
    let fileUpload = document.getElementById("fileUpload");
    let uploadZone = document.getElementById("uploadZone");
};


function HandleFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();

    //simulates a mouse click
    fileUpload.click();
}

function HandleFiles(files) {

    const imageType = /image.*/;

    if (!files || files.length === 0) {
        document.getElementById("img").src = "";
        return;
    }

    if (!files[0].type.match(imageType)) {
        alert("檔案類型無效")
        document.getElementById("img").src = "";
        fileUpload.value = "";
        document.querySelector(".imgInfo").textContent = "";
        document.getElementById("ImagePath").value = "";
        return;
    }

    var reader = new FileReader();
    reader.onload = async function (e) {
        //console.log(e.target.result);
        document.getElementById("img").src = e.target.result;
        document.getElementById("ImagePath").value = files[0].name;
        let imgDimensions = await GetImageDimensions(e.target.result);

        document.querySelector(".imgInfo").textContent = `Name：${files[0].name}，
                            Size：${Math.floor((files[0].size) / 1024)}KB，Dimensions： ${imgDimensions.width} x ${imgDimensions.height}`;

    }
    reader.readAsDataURL(files[0]);
}

function GetImageDimensions(imageData) {
    return new Promise((resovle, reject) => {
        let img = new Image();
        img.onload = () => {
            resovle({ width: img.width, height: img.height })
        }
        img.src = imageData;
    });
}

let counter = 0;

function Dragenter(e) {
    // uploadZone.classList.add("uploadZone-enter");
    uploadZone.classList.remove("bg-info");
    uploadZone.classList.add("bg-secondary");
    counter++;
    console.log(counter);
    e.stopPropagation();
    e.preventDefault();
}

function Dragleave(e) {
    counter--;
    console.log(counter);
    if (counter === 0) {
        uploadZone.classList.remove("uploadZone-enter");
        uploadZone.classList.add("bg-info");
    }
}

function Dragover(e) {
    e.stopPropagation();
    e.preventDefault();
}

function Drop(e) {
    e.stopPropagation();
    e.preventDefault();
    console.log('drop' + counter);
    counter = 0;
    console.log(counter);
    uploadZone.classList.remove("uploadZone-enter");
    uploadZone.classList.add("bg-info");



    fileUpload.files = e.dataTransfer.files;
    HandleFiles(e.dataTransfer.files);
    uploadZone.classList.remove("uploadZone-enter");
}

fileUpload.addEventListener("change", function (e) { HandleFiles(this.files) });
uploadZone.addEventListener("click", HandleFileSelect);
uploadZone.addEventListener("dragenter", Dragenter);
uploadZone.addEventListener("dragleave", Dragleave);
uploadZone.addEventListener("dragover", Dragover);
uploadZone.addEventListener("drop", Drop);