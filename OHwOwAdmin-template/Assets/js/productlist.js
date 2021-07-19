let app = new Vue({
    el: "#productlist",
    data() {
        return {
            isBusy: false,
            items: [
                { isActive: true, age: 40, name: { first: 'Dickerson', last: 'Macdonald' } },
                { isActive: false, age: 21, name: { first: 'Larsen', last: 'Shaw' } },
                {
                    isActive: false,
                    age: 9,
                    name: { first: 'Mini', last: 'Navarro' },
                    _rowVariant: 'success'
                },
                { isActive: false, age: 89, name: { first: 'Geneva', last: 'Wilson' } },
                { isActive: true, age: 38, name: { first: 'Jami', last: 'Carney' } },
                { isActive: false, age: 27, name: { first: 'Essie', last: 'Dunlap' } },
                { isActive: true, age: 40, name: { first: 'Thor', last: 'Macdonald' } },
                {
                    isActive: true,
                    age: 87,
                    name: { first: 'Larsen', last: 'Shaw' },
                    _cellVariants: { age: 'danger', isActive: 'warning' }
                },
                { isActive: false, age: 26, name: { first: 'Mitzi', last: 'Navarro' } },
                { isActive: false, age: 22, name: { first: 'Genevieve', last: 'Wilson' } },
                { isActive: true, age: 38, name: { first: 'John', last: 'Carney' } },
                { isActive: false, age: 29, name: { first: 'Dick', last: 'Dunlap' } }
            ],
            fields: [
                { key: 'productId', label: '商品編號', sortable: true, sortDirection: 'desc' },
                { key: 'productName', label: '商品名稱', sortable: true, sortDirection: 'desc' },
                { key: 'productImg', label: '商品圖片' },
                { key: 'authorName', label: '作者', sortable: true, sortDirection: 'desc' },
                { key: 'publisherName', label: '出版社', sortable: true, sortDirection: 'desc' },
                { key: 'mainCategory', label: '主分類', sortable: true, sortDirection: 'desc' },
                { key: 'subCategory', label: '子分類', sortable: true, sortDirection: 'desc' },
                { key: 'fixedPrice', label: '單價', sortable: true, sortDirection: 'desc' },
                { key: 'name', label: 'Person full name', sortable: true, sortDirection: 'desc' },
                { key: 'age', label: 'Person age', sortable: true, class: 'text-center' },
                {
                    key: 'isActive',
                    label: 'Is Active',
                    formatter: (value, key, item) => {
                        return value ? 'Yes' : 'No'
                    },
                    sortable: true,
                    sortByFormatted: true,
                    filterByFormatted: true
                },
                { key: 'actions', label: 'Actions' }
            ],
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
    created() {
        this.getSimplifyProducts();
    },
    mounted() {
        // Set the initial number of items
        this.totalRows = this.items.length
    },
    methods: {
        getSimplifyProducts() {
            this.isBusy = true;
            let cfg = {
                methods: 'get',
                headers: { 'Content-type': 'application/json' },
                url: 'https://localhost:5001/api/Product/GetSimplifyProducts'
            };

            axios(cfg)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    console.log(res.status);
                    if (Array.isArray(res.data.result) && res.status == 200) {
                        this.isBusy = false;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
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
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        toggleBusy() {
            this.isBusy = !this.isBusy
        }
    }
});