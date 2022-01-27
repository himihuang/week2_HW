import {createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js'

let productModal = '';

createApp({

    data(){
        return{
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'himiapi',
            products: [],
            temp: {
                imagesUrl:[]
            },
            isEdit: false,
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
                // console.log(this.temp);
                this.isEdit = true;
                productModal.show();

            }else{
               
                this.temp = { imagesUrl:[] };
                this.isEdit = false;
                productModal.show();
            }

           
          
        },
        saveProduct(){

            if(this.isEdit){
                axios.put(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temp.id}`, { data: this.temp })
                .then((res)=>{
                    this.getData();
                    productModal.hide();
                })
                .catch((err)=>{
                    // console.dir(err.message)
                })
            }else{
                axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/product`, { data: this.temp })
                .then((res)=>{
                    
                    this.getData();
                    productModal.hide();

                })
                .catch((err)=>{
                })
            }
        },
        uploadImages(e){
            let file  = e.target.files[0];
            let formData = new FormData();
            formData.append('file-to-upload', file)
            let vm = this;
            axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/upload`, formData)
            .then((res)=>{
                if(!this.temp.imageUrl){
                    this.temp.imageUrl = res.data.imageUrl
                }
                else{
                    this.temp.imagesUrl.push(res.data.imageUrl)

                }
          


            })
            .catch((err)=>{
                // console.log(err)
            })
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

}).mount('#app');