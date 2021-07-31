let app = new Vue({
    el: "#productadd",
    data() {
        return {
            inputData: {
                onSale: false,
                productName: '',
                authorId: '',
                publisherId: '',
                mainCategoryId: '',
                subCategoryId: '',
                ISBN: '',
                price: 0,
                languageId: '',
                file: null,
                image: null,
                description: ''

            },

            inputDataCheck: {
                productName: { error: false, errorMsg: '' },
                author: { error: false, errorMsg: '' },
                publisher: { error: false, errorMsg: '' },
                mainCategory: { error: false, errorMsg: '' },
                subCategory: { error: false, errorMsg: '' },
                ISBN: { error: false, errorMsg: '' },
                price: { error: false, errorMsg: '' },
                language: { error: false, errorMsg: '' },
                file: { error: false, errorMsg: '' },
                image: { error: false, errorMsg: '' },
                description: { error: false, errorMsg: '' },
            },
            authorlist: {
                busy: false,
                options: [],
                // options: [
                //     { value: '1', label: '亨利・大衛・梭羅(henry david thoreau)' },
                //     { value: '2', label: '謝孟恭' },
                //     { value: '3', label: '培峰' },
                //     { value: '4', label: '泰勒．柯文' },
                //     { value: '5', label: '彼得．霍林斯（peter hollins）' },
                //     { value: '6', label: '伊恩‧里德(Iain Reid)' },
                // ],
            },
            publisherlist: {
                busy: false,
                options: [],
                // options: [
                //     { value: '2', label: '天下文化出版社' },
                //     { value: '3', label: '今周刊出版社' },
                //     { value: '4', label: '早安財經文化有限公司' },
                //     { value: '5', label: '方言文化' },
                //     { value: '6', label: '城邦出版集團' },
                //     { value: '7', label: '漫遊者文化事業股份有限公司' }
                // ],
            },
            mainCategorylist: {
                busy: false,
                options: [],
                // options: [
                //     { value: '1', label: '企業與金融' },
                //     { value: '2', label: '愛情' },
                //     { value: '3', label: '傳記與回憶錄' },
                //     { value: '4', label: '期刊' },
                //     { value: '5', label: '兒童' },
                //     { value: '6', label: '漫畫與圖像小說' },
                // ],

            },
            subCategorylist: {
                busy: false,
                options: [],
                // options: [
                //     { value: '1', label: '人力資源與人事管理' },
                //     { value: '2', label: '企業家精神與小型企業' },
                //     { value: '3', label: '個人財務' },
                //     { value: '4', label: '工業與專業' },
                //     { value: '5', label: '會計' },
                //     { value: '6', label: '業務參考' },
                // ],
            },
            languagelist: {
                busy: false,
                options: [],
                // options: [
                //     { value: '1', label: '中文' },
                // ],
            },

            tabIndex: 0,
            isPageBusy: false,


            //先保留
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

            progressModal: {
                id: 'progress-modal',
                title: '',
                value: 0,
                max: 100,
                description: '0%'
            },


            //描述頁面是否忙碌中，EX:進行非同步作業 先保留
            isOnSaleBusy: { PageBusy: false, DetailsBusy: false },
            isNonSaleBusy: { PageBusy: false, DetailsBusy: false },

            //url列表
            //for live server
            urllist: {
                authorList: 'https://localhost:5001/api/Product/GetAuthorList',
                publisherList: 'https://localhost:5001/api/Product/GetPublisherList',
                categoryList: 'https://localhost:5001/api/Product/GetCategoryList',
                languageList: 'https://localhost:5001/api/Product/GetLanguageList',

                simplifyproductsOnSale: 'https://localhost:5001/api/Product/GetSimplifyProductsOnSale',
                simplifyproductsNonSale: 'https://localhost:5001/api/Product/GetSimplifyProductsNonSale',
                productDetails: 'https://localhost:5001/api/Product/GetProductDetails',
                UpdateProductSalesStatus: 'https://localhost:5001/api/Product/UpdateProductSalesStatus',
            },

            //details modal 先保留
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

            //商品上下架MessageBox參數 先保留
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
            },

            testAAA: {
                key1: { error: false, msg: '' }
            },

            signalR: {
                connection: '',
                callerId: '',
            }

        }
    },
    computed: {
        allValidation() {
            let invalid = Object.keys(this.inputDataCheck).some(key => this.inputDataCheck[key].error === true);
            return {
                error: invalid,
                errorMsg: invalid ? '尚有無效的輸入欄位' : ''
            }
        }
    },
    watch: {
        inputDataCheck: function () {
            console.log('check');
        },
        'inputData.productName': {
            immediate: true,
            handler: function () {
                if (this.inputData.productName == '') {
                    this.inputDataCheck.productName.error = true;
                    this.inputDataCheck.productName.errorMsg = '商品名稱不得為空';
                } else {
                    this.inputDataCheck.productName.error = false;
                    this.inputDataCheck.productName.errorMsg = '';

                }
            },
        },
        'inputData.authorId': {
            immediate: true,
            handler: function (value) {
                if (value) {
                    this.inputDataCheck.author.error = false;
                    this.inputDataCheck.author.errorMsg = '';
                } else {
                    this.inputDataCheck.author.error = true;
                    this.inputDataCheck.author.errorMsg = '請選擇作者';
                }
            }
        },
        'inputData.publisherId': {
            immediate: true,
            handler: function (value) {
                if (value) {
                    this.inputDataCheck.publisher.error = false;
                    this.inputDataCheck.publisher.errorMsg = '';
                } else {
                    this.inputDataCheck.publisher.error = true;
                    this.inputDataCheck.publisher.errorMsg = '請選擇出版社';
                }
            }
        },
        'inputData.mainCategoryId': {
            immediate: true,
            handler: function (value) {
                if (value) {
                    this.inputDataCheck.mainCategory.error = false;
                    this.inputDataCheck.mainCategory.errorMsg = '';
                } else {
                    this.inputDataCheck.mainCategory.error = true;
                    this.inputDataCheck.mainCategory.errorMsg = '請選擇主分類';
                }
            }
        },
        'inputData.subCategoryId': {
            immediate: true,
            handler: function (value) {
                if (value) {
                    this.inputDataCheck.subCategory.error = false;
                    this.inputDataCheck.subCategory.errorMsg = '';
                } else {
                    this.inputDataCheck.subCategory.error = true;
                    this.inputDataCheck.subCategory.errorMsg = '請選擇子分類';
                }
            }
        },
        'inputData.ISBN': {
            immediate: true,
            handler: function (value) {
                let ISBNRegexp = /^\d{13}$|^\d{10}$/;

                if (!ISBNRegexp.test(value)) {
                    this.inputDataCheck.ISBN.error = true;
                    this.inputDataCheck.ISBN.errorMsg = 'ISBN格式為10位或13位數字';
                } else {
                    this.inputDataCheck.ISBN.error = false;
                    this.inputDataCheck.ISBN.errorMsg = '';
                }
            }
        },
        'inputData.price': {
            immediate: true,
            handler: function (value) {
                if (value < 0) {
                    this.inputDataCheck.price.error = true;
                    this.inputDataCheck.price.errorMsg = '價錢不得大於';
                }
            }
        },
        'inputData.languageId': {
            immediate: true,
            handler: function (value) {
                if (value) {
                    this.inputDataCheck.language.error = false;
                    this.inputDataCheck.language.errorMsg = '';
                } else {
                    this.inputDataCheck.language.error = true;
                    this.inputDataCheck.language.errorMsg = '請選擇語言';
                }
            }
        },
        'inputData.file': {
            immediate: true,
            handler: function (value) {
                if (value) {
                    this.inputDataCheck.file.error = false;
                    this.inputDataCheck.file.errorMsg = '';
                } else {
                    this.inputDataCheck.file.error = true;
                    this.inputDataCheck.file.errorMsg = '請上傳商品檔案';
                }
            }
        },
        'inputData.image': {
            immediate: true,
            handler: function (value) {
                if (value) {
                    this.inputDataCheck.image.error = false;
                    this.inputDataCheck.image.errorMsg = '';
                } else {
                    this.inputDataCheck.image.error = true;
                    this.inputDataCheck.image.errorMsg = '請上傳商品圖片';
                }
            }
        },
        'inputData.description': {
            immediate: true,
            handler: function (value) {
                if (value) {
                    this.inputDataCheck.description.error = false;
                    this.inputDataCheck.description.errorMsg = '';
                } else {
                    this.inputDataCheck.description.error = true;
                    this.inputDataCheck.description.errorMsg = '商品簡介不得為空';
                }
            }
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
    async created() {
        let pageSelectors = await this.GetPageSelectors();

        let [author, publisher, category, language] = pageSelectors;

        this.authorlist.options = author.data.result.map(x => { return { value: x.id, label: x.name } });
        this.publisherlist.options = publisher.data.result.map(x => { return { value: x.id, label: x.name } });
        this.languagelist.options = language.data.result.map(x => { return { value: x.id, label: x.name } });
        this.mainCategorylist.options = category.data.result.map(x => { return { value: x.mainCategoryID, label: x.mainCategoryName } });
        //this.subCategorylist.options = res.data.result.map(x => { return { value: x.id, label: x.name } });












        console.log(pageSelectors);









        //初始化頁面
        this.tabIndex = 0;
        // this.OnSalePage();

        this.imgFileUpload.imageInfo = this.CreateImgUploadImgInfo();
        //console.log(testA());

        //this.quill = GetQuillInstance('#description-editor');
        //let aa = GetQuillInstance('#description-editor');
        //console.log(aa);
        //aa.on('text-change', function (delta, oldDelta, source) {
        //    console.log('aa');
        //    if (source == 'api') {
        //        console.log("An API call triggered this change.");
        //    } else if (source == 'user') {
        //        //this.inputData.description = 
        //        //console.log(delta);
        //        console.log("A user action triggered this change.");
        //    }
        //});



    },
    mounted() {
        this.InitSignalR();
        //this.quill.on('text-change', function (delta, oldDelta, source) {
        //    console.log('aa');
        //    if (source == 'api') {
        //        //console.log("An API call triggered this change.");
        //    } else if (source == 'user') {
        //        //this.inputData.description = 
        //        console.log(delta);
        //        //console.log("A user action triggered this change.");
        //    }
        //});
    },
    methods: {
        //SignalR初始化
        InitSignalR() {
            this.signalR.connection = new signalR.HubConnectionBuilder().withUrl("/progressHub").build();

            //設定開始連接，當連接成功時去取得ConnectionID
            this.signalR.connection.start()
                .then(() => {
                    //呼叫Hub上的GetConnectionID
                    this.signalR.connection.invoke("GetConnectionID")
                        .then(res => {
                            this.signalR.callerId = res;
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }).catch(err => {
                    console.error(err);
                });

            //設定當從Hub接收到AddProgress訊息時，所要做的事情
            this.signalR.connection.on("AddProgress", (percentage) => {
                //更新進度條
                this.progressModal.value = percentage;
                this.progressModal.description = `${percentage}%`;
                console.log(percentage)
            });
        },
        submit() {
            let formdata = new FormData();

            Object.keys(this.inputData).forEach(key => {
                // console.log(key);
                // console.log(this.inputData[key]);
                let value;
                if (key === 'description') {
                    //value = JSON.stringify(quill.root.getInnerHTML());
                    value = quill.root.getInnerHTML();

                } else {
                    value = this.inputData[key];
                }
                console.log(value);

                formdata.append(key, value);
            });

            formdata.append('signalid', this.signalR.callerId);
            // console.log(data);
            // console.log(data.getAll());

            let cfg = {
                method: 'post',
                headers: { 'Content-type': 'multipart/form-data' },
                data: formdata,
                url: 'https://localhost:5001/api/Product/Create',
            };
            this.$bvModal.show(this.progressModal.id);
            axios(cfg)
                .then(res => {
                    console.log(res);
                    if (res.data.status === 0) {
                        console.log("success");
                        window.location.href = "/Product/Index";
                    }
                    console.log(res.data);
                }).catch(err => {
                    console.log(err);
                }).finally(() => {
                    this.$bvModal.hide(this.progressModal.id);
                });
        },
        //設定頁面預設狀態
        SetPageDefault() {
        },

        //取得頁面所有選擇清單的資料
        GetPageSelectors() {
            let author = this.getSelectorOptions(this.urllist.authorList);
            let publisher = this.getSelectorOptions(this.urllist.publisherList);
            let category = this.getSelectorOptions(this.urllist.categoryList);
            let language = this.getSelectorOptions(this.urllist.languageList);

            return Promise.all([author, publisher, category, language])
        },
        //切換下架商品頁
        NonSalePage() {
            // console.log('Nonsalepage');
            this.SetPageDefault();
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
        getSelectorOptions(uri) {
            let cfg = {
                method: 'get',
                headers: { 'Content-type': 'application/json' },
                url: uri
            };
            return axios(cfg);
        },


        //取得作者清單
        getAuthorsData(uri, busyobj) {
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
        resetProgressModal() {
            this.progressModal.value = 0;
            this.progressModal.description = '';
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
            this.inputData.image = files[0];
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
        visible() {

        },
        change() {

        }
    }
});



let quill;

function testA() {
    quill = GetQuillInstance('#description-editor');
    quill.on('text-change', function (delta, oldDelta, source) {
        if (source == 'api') {
            console.log("An API call triggered this change.");
        } else if (source == 'user') {
            //this.inputData.description = 
            //console.log(delta);
            console.log("A user action triggered this change.");
            console.log(delta);
            console.log(oldDelta);
            app.$data.inputData.description = delta;

        }
    });


    return quill;
}

testA();
