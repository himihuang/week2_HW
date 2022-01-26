import {createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js'

let productModal = '';

createApp({

    data(){
        return{
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'himiapi',
            products: [],
            temp: {},
            isEdit: false
        }
    },
    methods: {
        checkLogin(){
            axios.post(`${this.apiUrl}/api/user/check`)
            .then((res)=>{
                // console.log(res)
            })
            .catch((err)=>{
                // console.log(err)
            })
        },
        getData(){
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products/all`)
            .then((res)=>{
                // console.log(res.data)
                this.products = res.data.products;

            })
            .catch((err)=>{
                // console.log(err)
            })
        },
        showTemp(product){
            this.temp = product;
        },
        delItem(product){
            axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${product}`)
            .then((res)=>{
                // console.log(res)
                this.products = res.data.products;

            })
            .catch((err)=>{
                // console.log(err)
            })
        },
        toggleModal(isEdit,product){
           

            if(isEdit =='edit')
            {
                this.temp  = {...product};
                this.isEdit = true;
                productModal.show();

            }else{
                this.temp = { };
                this.isEdit = false;
                productModal.show();
            }

           
          
        },
        saveProduct(){

            if(this.isEdit){
                axios.put(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temp.id}`)
                .then((res)=>{
                    console.log(res)
                    productModal.hide();
                })
                .catch((err)=>{
                    console.log(err)
                })
            }else{
                console.log(typeof this.temp.price);
                console.log(this.products)
                axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/product`, { data: this.temp })
                .then((res)=>{
                    console.log('res',res.data.message)
                    this.getData();
                    productModal.hide();

                })
                .catch((err)=>{
                    console.log('err',err.data.message)
                })
            }
        }
    },
    created() {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)himitoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;

        this.checkLogin();
        this.getData()

    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'))

    },
    updated(){
        this.getData()
    }
}).mount('#app');