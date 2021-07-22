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
            infoModal: {
                id: 'info-modal',
                title: '',
                content: ''
            },

            //描述頁面是否忙碌中，EX:進行非同步作業
            isOnSaleBusy: { PageBusy: false, DetailsBusy: false },
            isNonSaleBusy: { PageBusy: false, DetailsBusy: false },

            //url列表
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
                height: 60,
            },

            //商品上下架MessageBox參數
            SalesConfirmBoxProps: {
                onSale: { message: '請再次確認是否要上架商品', data: { SaleStatus: true } },
                nonSale: { message: '請再次確認是否要下架商品', data: { SaleStatus: false } }
            }


        }
    },
    computed: {

    },
    watch: {
        items: function () {
            this.totalRows = this.items.length
        },
        tabIndex: function () {
            switch (this.tabIndex) {
                case 0:
                    this.OnSalePage();
                    break;
                case 1:
                    this.NonSalePage();
                    break;
                default:
                    break;
            }
        }
    },
    created() {
        //初始化頁面
        this.tabIndex = 0;
        this.OnSalePage();



    },
    mounted() {

    },
    methods: {
        SetProductOnSales(id) {
            let data = {
                ID: id,
                SaleStatus: true,
            }
            this.UpdateProductSalesStatus(this.urllist.UpdateProductSalesStatus, data)
        },
        SetProductNonSales(id) {
            let data = {
                ID: id,
                SaleStatus: false,
            }
            this.UpdateProductSalesStatus(this.urllist.UpdateProductSalesStatus, data)
        },

        SetPageDefault() {
            this.items = [];
            this.totalRows = 1;
            this.currentPage = 1;
            this.perPage = 5;
            this.sortBy = '';
            this.sortDesc = false;
            this.filter = null;
        },
        OnSalePage() {
            // console.log('onsalepage');
            this.SetPageDefault();
            this.getSimplifyProducts(this.urllist.simplifyproductsOnSale, this.isOnSaleBusy);
        },
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
        async info(item, index, button) {
            try {
                this.isOnSaleBusy.DetailsBusy = true;

                this.infoModal.title = `Row index: ${index}`
                this.$root.$emit('bv::show::modal', this.infoModal.id, button);
                let response = await this.getProductDetails(this.urllist.productDetails, item.productId);

                if (response.status == 200) {
                    this.infoModal.content = JSON.stringify(response.data.result, null, 2);
                }
            } catch (err) {
                console.log(err);
            } finally {
                this.isOnSaleBusy.DetailsBusy = false;
            }
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

            axios(cfg)
                .then(res => {
                    if (res.status == 200) {
                        switch (res.data.status) {
                            case 0:
                                let index = this.items.findIndex(x => x.productId === data.ID)
                                if (index >= 0) {
                                    this.items.splice(index, 1);
                                }
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
                });
        },
        async info(item, index, button) {
            try {
                this.isOnSaleBusy.DetailsBusy = true;

                this.infoModal.title = `Row index: ${index}`
                this.$root.$emit('bv::show::modal', this.infoModal.id, button);
                let response = await this.getProductDetails(this.urllist.productDetails, item.productId);

                if (response.status == 200) {
                    this.infoModal.content = JSON.stringify(response.data.result, null, 2);
                }
            } catch (err) {
                console.log(err);
            } finally {
                this.isOnSaleBusy.DetailsBusy = false;
            }
        },
        resetInfoModal() {
            this.infoModal.title = ''
            this.infoModal.content = ''
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        toggleBusy() {
            this.isOnSaleBusy.PageBusy = !this.isOnSaleBusy.PageBusy;
        },
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

