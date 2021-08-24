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
            //下拉選單列表
            authorlist: {
                busy: false,
                options: [],
            },
            publisherlist: {
                busy: false,
                options: [],
            },
            mainCategorylist: {
                busy: false,
                options: [],
            },
            subCategorylist: {
                busy: false,
                options: [],
            },
            languagelist: {
                busy: false,
                options: [],
            },
            databuffer: {
                category: [],
            },

            tabIndex: 0,
            isPageBusy: false,
            quill: '',

            //進度條Modal
            progressModal: {
                id: 'progress-modal',
                title: '',
                value: 0,
                max: 100,
                description: '0%'
            },

            //url列表
            urllist: {
                authorList: 'https://localhost:5001/api/Product/GetAuthorList',
                publisherList: 'https://localhost:5001/api/Product/GetPublisherList',
                categoryList: 'https://localhost:5001/api/Product/GetCategoryList',
                languageList: 'https://localhost:5001/api/Product/GetLanguageList',
                productSubmit: '/api/Product/Create',
            },

            //商品圖片延遲載入的參數
            productimgProps: {
                blank: true,
                blankColor: '#bbb',
                width: 240,
                height: 340
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
            //記錄signalR的資訊
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
                    this.MainCategoryChange(value);
                    this.inputData.subCategoryId = '';
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
    },
    async created() {
        this.isPageBusy = true;

        let pageSelectors = await this.GetPageSelectors();
        //初始化頁面資料
        let [author, publisher, category, language] = pageSelectors;
        this.authorlist.options = author.data.result.map(x => { return { value: x.id, label: x.name } });
        this.publisherlist.options = publisher.data.result.map(x => { return { value: x.id, label: x.name } });
        this.languagelist.options = language.data.result.map(x => { return { value: x.id, label: x.name } });
        this.mainCategorylist.options = category.data.result.map(x => { return { value: x.mainCategoryID, label: x.mainCategoryName } });
        this.databuffer.category = category.data.result;
        this.tabIndex = 0;
        this.imgFileUpload.imageInfo = this.CreateImgUploadImgInfo();

        this.isPageBusy = false;
    },
    mounted() {
        this.InitSignalR();
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
                // console.log(percentage)
            });
        },
        //產品發佈
        ProudctSubmit() {
            //建立FormData
            let formdata = new FormData();

            Object.keys(this.inputData).forEach(key => {
                let value;
                if (key === 'description') {
                    value = quill.root.getInnerHTML();
                } else {
                    value = this.inputData[key];
                }

                formdata.append(key, value);
            });

            formdata.append('signalid', this.signalR.callerId);

            //發送formdata至API
            let cfg = {
                method: 'post',
                headers: { 'Content-type': 'multipart/form-data' },
                data: formdata,
                url: urllist.productSubmit,
            };
            this.$bvModal.show(this.progressModal.id);
            axios(cfg)
                .then(res => {
                    // console.log(res);
                    if (res.data.status === 0) {
                        window.location.href = "/Product/Index";
                    }
                }).catch(err => {
                    console.log(err);
                }).finally(() => {
                    this.$bvModal.hide(this.progressModal.id);
                });
        },
        //取得頁面所有選擇清單的資料
        GetPageSelectors() {
            let author = this.getSelectorOptions(this.urllist.authorList);
            let publisher = this.getSelectorOptions(this.urllist.publisherList);
            let category = this.getSelectorOptions(this.urllist.categoryList);
            let language = this.getSelectorOptions(this.urllist.languageList);

            return Promise.all([author, publisher, category, language]);
        },
        MainCategoryChange(maincategoryid) {
            let category = this.databuffer.category.filter(x => x.mainCategoryID === maincategoryid)[0];
            this.subCategorylist.options = category.subCategories.map(x => { return { value: x.subCategoryID, label: x.subCategoryName } });
        },
        //取得下拉列表清單
        getSelectorOptions(uri) {
            let cfg = {
                method: 'get',
                headers: { 'Content-type': 'application/json' },
                url: uri
            };
            return axios(cfg);
        },
        resetProgressModal() {
            this.progressModal.value = 0;
            this.progressModal.description = '';
        },
        //處理input type="file" 內容改變的事件
        ImgFilesInput(files) {
            const imageType = /image.*/;

            if (!files || files.length === 0) {
                this.imgFileUpload.isValid = false;
                this.imgFileUpload.imageInfo = this.CreateImgUploadImgInfo();
                return;
            }

            if (!files[0].type.match(imageType)) {
                alert("檔案類型無效")
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
        tabchange() {
            if (!this.quill) {
                this.quill = GetQuillInstance('#description-editor');
                this.quill.on('text-change', (delta, oldDelta, source) => {
                    if (source == 'api') {

                    } else if (source == 'user') {
                        this.inputData.description = delta;
                    }
                });

            }
        }
    }
});