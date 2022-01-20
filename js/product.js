import {createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js'

createApp({

    data(){
        return{
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'himiapi',
            products: [],
            temp: {}
        }
    },
    methods: {
        checkLogin(){
            axios.post(`${this.apiUrl}/api/user/check`)
            .then((res)=>{
                console.log(res)
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        getData(){
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products/all`)
            .then((res)=>{
                console.log(res.data)
                this.products = res.data.products;

            })
            .catch((err)=>{
                console.log(err)
            })
        },
        showTemp(product){
            this.temp = product;
        },
        delItem(product){
            axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${product}`)
            .then((res)=>{
                console.log(res)
                this.products = res.data.products;

            })
            .catch((err)=>{
                console.log(err)
            })
        }
    },
    created() {
        let token = document.cookie.replace(/(?:(?:^|.*;\s*)himitoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;

        this.checkLogin();
        this.getData()

    },
    updated(){
        this.getData()
    }
}).mount('#app');