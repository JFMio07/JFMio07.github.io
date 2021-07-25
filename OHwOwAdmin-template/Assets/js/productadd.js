let app = new Vue({
    el: "#productadd",
    data() {
        return {
            inputData: {
                onSale:false,
                account: "",
                password: "",
                checkPassword: "",
                name: "",
                tel: "",
                address: "",
                author:'',
                publisher:'',
                mainCategory:'',
                subCategory:'',
                file: null,
            },
            
            inputDataCheck: {
                accountError: false,
                accountErrorMsg: "",
                passwordError: false,
                passwordErrprMsg: "",
                checkPasswordError: false,
                checkPasswordErrorMsg: ""
            },
            authorlist:{
                busy:false,
                // options:[],
                options:[{value:'1',lable:'AA'}],
            },
            publisherlist:{
                busy:false,
                // options:[],
                options:[{value:'1',lable:'AA'}],

            },
            mainCategorylist:{
                busy:false,
                // options:[],
                options:[{value:'1',lable:'AA'}],

            },
            subCategorylist:{
                busy:false,
                // options:[],
                options:[{value:'1',lable:'AA'}],
            },
            props: {
                lazy: true,
                lazyLoad(node, resolve) {
                    const { level } = node;
                    setTimeout(() => {
                        const nodes = Array.from({ length: level + 1 })
                            .map(item => ({
                                value: ++id,
                                label: `选项${id}`,
                                leaf: level >= 2
                            }));
                        // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                        resolve(nodes);
                    }, 1000);
                }
            },

            items: [],
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


            productDetailsimgProps: {
                blank: true,
                blankColor: '#bbb',
                width: 240,
                height: 340
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
            quill: '',
            productimg: '',
            // 處理圖片上傳相關的狀態
            imgFileUpload: {
                dragEnterCounter: 0,
                isDragEnter: false,
                isValid: false,
                imageInfo: {
                    name: '',
                    data: '',
                    size: '',
                    width: '',
                    height: '',
                },
            }


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

        this.imgFileUpload.imageInfo = this.CreateImgUploadImgInfo();

        this.quill = GetQuillInstance('#description-editor');


        this.quill.on('text-change', function (delta, oldDelta, source) {
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
        },
        //處理input type="file" 內容改變的事件
        ImgFilesInput(files) {
            const imageType = /image.*/;

            if (!files || files.length === 0) {
                this.productimg = '';
                this.imgFileUpload.isValid = false;
                this.imgFileUpload.imageInfo = this.CreateImgUploadImgInfo();
                return;
            }

            if (!files[0].type.match(imageType)) {
                alert("檔案類型無效")
                this.productimg = '';
                this.imgFileUpload.isValid = false;
                this.$refs.imgFileInput.value = '';
                this.$refs.imgFileInput.files = null;
                this.imgFileUpload.imageInfo = this.CreateImgUploadImgInfo();
                return;
            }

            var reader = new FileReader();
            reader.onload = async (e) => {
                this.imgFileUpload.isValid = true;
                this.productimg = e.target.result;
                let imgDimensions = await GetImageDimensions(e.target.result);
                this.imgFileUpload.imageInfo = this.CreateImgUploadImgInfo(
                    files[0].name,
                    e.target.result,
                    Math.floor((files[0].size) / 1024),
                    imgDimensions.width,
                    imgDimensions.height,
                )
            }
            reader.readAsDataURL(files[0]);
        },
        //處理圖片上傳區域的Click事件
        ImgUploadZoneClick(e) {
            e.stopPropagation();
            e.preventDefault();

            //觸發input type file的click事件
            this.$refs.imgFileInput.click();
        },
        //處理圖片拖曳進入
        ImgUploadZoneDragenter(e) {
            e.stopPropagation();
            e.preventDefault();

            this.imgFileUpload.dragEnterCounter++;
            this.imgFileUpload.isDragEnter = true;

        },
        //處理圖片拖曳經過
        ImgUploadZoneDragover(e) {
            e.stopPropagation();
            e.preventDefault();
        },
        //處理圖片拖曳離開
        ImgUploadZoneDragleave(e) {
            this.imgFileUpload.dragEnterCounter--;
            // console.log(this.imgFileUpload.dragEnterCounter);

            if (this.imgFileUpload.dragEnterCounter === 0) {
                this.imgFileUpload.isDragEnter = false;
            }
        },
        //處理圖片拖曳後放開
        ImgUploadZoneDrop(e) {
            e.stopPropagation();
            e.preventDefault();

            this.imgFileUpload.dragEnterCounter = 0;
            this.imgFileUpload.isDragEnter = false;
            this.$refs.imgFileInput.files = e.dataTransfer.files;
            this.ImgFilesInput(e.dataTransfer.files);
        },
        //建立上傳後圖片資訊的物件
        CreateImgUploadImgInfo(name = '', data = '', size = '', width = '', height = '') {
            return {
                name: name,
                data: data,
                size: size,
                width: width,
                height: height,
            };
        },
        visible(){

        },
        change(){

        }
    }
});