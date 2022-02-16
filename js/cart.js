const apiUrl = 'https://vue3-course-api.hexschool.io/v2'
const apiPath = 'himiapi'

const app = Vue.createApp({
    data() {
        return{
            carts: {},
            products: [],
            id: '',
            cartData:  [],
            isLoading: '',
            total: 0,
        }
    },
    methods: {
        
        getProduct() {
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
            .then((res)=>{
                this.products = res.data.products;
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        openModal(id) {
            const newId = id+2;
            this.isLoading= newId
            this.id = id;
            axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
            .then((res)=>{
                this.$refs.pdModal.openModal()
                this.isLoading= ''
                
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        removeCart(id){
            this.isLoading = id;
            axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
            .then((res)=>{
                this.isLoading = ''
                this.getCarts()
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        updateCart(item) {
            console.log(item)
            axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, {data: item})
            .then((res)=>{
                this.getCarts();
            })
            .catch((err)=>{
                console.log(err)
            })

        },
        getCarts(){
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
            .then((res)=>{
                 
                this.cartData = res.data.data.carts;
                this.cartData.forEach(element => {
                    this.total = this.total+element.final_total
                });
               
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        addToCart(item, qty=1) {
            const newId = item.id + 1;

            this.isLoading = newId;
            const data = {
                product_id: item.id,
                qty: qty,
                product: item
            }
            
            axios.post(`${apiUrl}/api/${apiPath}/cart`,{ data: data})
            .then((res)=>{
                console.log(res)
                this.cartData.push(data);
                this.getCarts();
                this.isLoading = ''

            })
            .catch((err)=>{
                console.log(err)
            })
        },
        removeCartAll() {
            axios.delete(`${apiUrl}/api/${apiPath}/carts`)
            .then((res)=>{
                this.getCarts();
                this.total="";
                console.log(res)
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        checkPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/;
            if(value) {
                return phoneNumber.test(value)?true:'需填寫正確的電話號碼'
            }else{
                return '電話 為必填'
            }
        }
       
    },
    mounted() {
        this.getCarts();
        this.getProduct();

    }
})

app.component('product-modal',{
    template: '#userProductModal',
    props: ['product-id'],
    data() {
        return{
            pdModal: {},
            product: {},
            qty: 1
        }
    },
    methods: {
        openModal() {
            axios.get(`${apiUrl}/api/${apiPath}/product/${this.productId}`)
            .then((res)=>{
                this.product = res.data.product;
                this.pdModal.show()
            })
            .catch((err)=>{
                console.log(err)
            })
            
        },
        updateCart(){
            this.$emit('update-cart',this.product , this.qty);
            this.qty = 1;
            this.pdModal.hide()
        }
    },
    mounted() {
        this.pdModal = new bootstrap.Modal(this.$refs.modal);
    }
})

app.component('VForm',VeeValidate.Form );
app.component('VField',VeeValidate.Field );
app.component('ErrorMessage',VeeValidate.ErrorMessage );

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });


  VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

  // Activate the locale
  VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為輸入字元立即進行驗證
  });


app.mount('#app')