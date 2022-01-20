import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
    data(){
        return{
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'himiapi',
            user:{
                username: '',
                password: ''
            }
        }
    },
    methods:{
        isLogin(){
            axios.post(`${this.apiUrl}/admin/signin`, this.user)
            .then((res)=>{
                console.log(res)
                let {token, expired } = res.data;
                document.cookie = `himitoken=${token}; expires=${new Date(expired)};`
                window.location = 'product.html'
            })
            .catch((err)=>{
                console.log(err)
            })
 
        }
    }
}).mount('#app');