let app = new Vue({
    el: "#productlist",
    data() {
        return {
            isBusy: false,
            onSaleItems: [],
            nonSaleItems: [],
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
                    key: 'shelfDate',
                    label: '上架日期',
                    formatter: (value, key, item) => {
                        if (value == null) { return "" }
                        return DateFormat(value)
                        // return moment(value).format('YYYY-MM-DD HH:mm:ss');
                    },
                    sortable: true,
                    sortByFormatted: true,
                    filterByFormatted: true
                },
                { key: 'actions', label: '商品管理' }
            ],
            totalOnSaleRows: 1,
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
            urllist: {
                simplifyproductsOnSale: 'https://localhost:5001/api/Product/GetSimplifyProductsOnSale',
                simplifyproductsNonSale: 'https://localhost:5001/api/Product/GetSimplifyProductsNonSale',
            }
        }
    },
    computed: {
        sortOptions() {
            // Create an options list from our fields
            return this.fields
                .filter(f => f.sortable)
                .map(f => {
                    return { text: f.label, value: f.key }
                })
        }
    },
    watch: {
        onSaleItems: function () {
            this.totalOnSaleRows = this.onSaleItems.length
        },
    },
    created() {
        this.getSimplifyProductssOnSale(this.urllist.simplifyproductsOnSale);
    },
    mounted() {
       
    },
    methods: {
        getSimplifyProductssOnSale(uri) {
            // console.log(uri);
            let cfg = {
                methods: 'get',
                headers: { 'Content-type': 'application/json' },
                url: uri
            };

            axios(cfg)
                .then(res => {
                    console.log(res);
                    if (Array.isArray(res.data.result) && res.status == 200) {
                        this.isBusy = false;
                        this.onSaleItems = res.data.result.map((item, index) => {
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
                                shelfDate: item.shelfDate
                            }
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            this.isBusy = true;
        },
        info(item, index, button) {
            this.infoModal.title = `Row index: ${index}`
            this.infoModal.content = JSON.stringify(item, null, 2)
            this.$root.$emit('bv::show::modal', this.infoModal.id, button)
        },
        resetInfoModal() {
            this.infoModal.title = ''
            this.infoModal.content = ''
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalOnSaleRows = filteredItems.length
            this.currentPage = 1
        },
        toggleBusy() {
            this.isBusy = !this.isBusy
        }
    }
});