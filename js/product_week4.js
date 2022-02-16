
import {createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js'
import pagination from './pagination.js'

let productModal = '';
let delModal = '';

const app = createApp({
    data(){
        return{
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'himiapi',
            products: [],
            temp: {
                imagesUrl:[]
            },
            isEdit: false,
            pagination: {}
        }
    },
    components:{
      pagination
    },
    methods: {
        checkLogin(){
            axios.post(`${this.apiUrl}/api/user/check`)
            .then((res)=>{
                // console.log(res)
                this.getData()
            })
            .catch((err)=>{
                // console.log(err)
                window.location = 'index.html'
            })
        },
        getData(page=1){
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`)
            .then((res)=>{
                
                
                this.products = res.data.products;
                this.pagination = res.data.pagination;

            })
            .catch((err)=>{
                // console.log(err)
            })
        },
        showTemp(product){
            this.temp = product;
        },
        delItem(product){
            product = this.temp.id;
            axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${product}`)
            .then((res)=>{
                // console.log(res)
                this.getData();
                delModal.hide();

            })
            .catch((err)=>{
                // console.log(err)
            })
        },
        toggleDelModal(isEdit,product ){
            if(isEdit =='edit')
            {
                this.isEdit = true;
                this.temp  = JSON.parse(JSON.stringify(product))
                delModal.show();
            }else{
                this.isEdit = false;
                this.temp = { imagesUrl:[] };
                delModal.show();

            }
        },
        toggleModal(isEdit,product){
           
            if(isEdit =='edit')
            {
                this.isEdit = true;
                this.temp  = JSON.parse(JSON.stringify(product))
                if(!this.temp.imagesUrl){
                  this.temp.imagesUrl = []
                }else if(!this.temp.imageUrl){
                  this.temp.imageUrl = ''
                }
                productModal.show();

            }else{
                this.temp = { imagesUrl:[] };
                this.isEdit = false;
                productModal.show();
            }

           
          
        },
       
       
    },
    created() {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)himitoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;

        this.checkLogin();
        

    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'))
        delModal = new bootstrap.Modal(document.getElementById('delModal'))

    },

})


// app.component('pagination',{
//     props: ['pages'],
//     template:`
    
//     <nav aria-label="Page navigation example">
//   <ul class="pagination justify-content-center">
//     <li class="page-item" :class="{disabled: !pages.has_next}">
//       <a class="page-link" href="#" aria-label="Previous">
//         <span aria-hidden="true">&laquo;</span>
//       </a>
//     </li>
//     <li class="page-item" v-for="page in pages.total_pages" :key="page"  :class="{active: page == pages.current_page}">
//         <a class="page-link" href="#" @click="$emit('change-page', page)">{{page}}</a>
//     </li>

//     <li class="page-item" :class="{disabled: !pages.has_pre}">
//       <a class="page-link" href="#" aria-label="Next">
//         <span aria-hidden="true">&raquo;</span>
//       </a>
//     </li>
//   </ul>
// </nav>
//     `
// })


app.component('showModal',{
    data(){
        return{
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'himiapi',
            tempImg: ''
        }
    },
    props: ['temp','isEdit'],
    methods: {
        saveProduct(){

            if(this.isEdit){
                axios.put(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temp.id}`, { data: this.temp })
                .then((res)=>{
                    // this.getData();
                    this.$emit('save-data')
                    productModal.hide();
                })
                .catch((err)=>{
                    // console.dir(err.message)
                })
            }else{
                axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/product`, { data: this.temp })
                .then((res)=>{
                    this.$emit('save-data')
                    // this.getData();
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
        },
        addImages(){
          if(this.tempImg!==''){
            this.temp.imagesUrl.push(this.tempImg)
            // console.log(this.temp.imagesUrl)
            this.tempImg  = ''
          }else{
            return
          }

        }
    },
    mounted(){
      
    },
    template:` 
    <div class="modal" tabindex="-1" id="productModal">
    <div class="modal-dialog modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" v-show="isEdit">編輯產品</h5>
          <h5 class="modal-title" v-show="!isEdit">新增產品</h5>

          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12">
              <div class="form-group mb-3">
                <label for="title" class="form-label">標題</label>
                <input type="text" class="form-control" id="title" v-model="temp.title">
              </div>
              <div class="row">
                <div class="col-12 col-sm-6">
                  <div class="form-group mb-3">
                    <label for="category" class="form-label">分類</label>
                    <input type="text" class="form-control" id="category" v-model="temp.category">
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="form-group mb-3">
                    <label for="unit" class="form-label">單位</label>
                    <input type="text" class="form-control" id="unit" v-model="temp.unit">
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-12 col-sm-6">
                  <div class="form-group mb-3">
                    <label for="origin_price" class="form-label">原價</label>
                    <input type="number" class="form-control" id="origin_price" v-model.number="temp.origin_price">
                  </div>
                </div>

                <div class="col-12 col-sm-6">
                  <div class="form-group mb-3">
                    <label for="price" class="form-label">售價</label>
                    <input type="number" class="form-control" id="price" v-model.number="temp.price">
                  </div>
                </div>
              </div>


              <div class="row">
                <div class="col-12">
                  <div class="form-group mb-3">
                    <label for="des">產品描述</label>
                    <textarea 
                    name="des" type="text" 
                    id="des" class="form-control"
                    cols="30" 
                    rows="5"
                    placeholder="請輸入產品描述"
                    v-model="temp.description"
                    ></textarea>
                  </div>
                </div>
              </div>


              <div class="row">
                <div class="col-12">
                  <div class="form-group mb-3">
                    <label for="content" class="form-label">說明內容</label>
                    <textarea 
                    name="content" type="text" 
                    id="content" class="form-control"
                    cols="30" 
                    rows="5"
                    placeholder="請輸入說明內容"
                    v-model="temp.content"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <div class="form-group mb-3">
                    <input 
                    type="checkbox" 
                    id="isOpen" 
                    v-model="temp.is_enabled"
                    :true-value="1"
                    :false-value="0">
                    <label for="isOpen" class="ms-2">是否啟用</label>

                  </div>
                </div>
              </div>

              <div class="form-group mb-3">
                <label class="form-label">主圖</label>
                <input type="text" id="upload" class="form-control mb-3" v-model="temp.imageUrl">
              </div>
              <img :src="temp.imageUrl" class="img-fluid mb-3" alt="">

              <div class="img-group d-flex flex-row flex-wrap">
                <label class="form-label">多圖</label>
                <input type="text" class="form-control mb-3" v-model="tempImg">
                <template v-for="(img,index) in temp.imagesUrl" :key="index+'123'">
                  
                  <img :src="temp.imagesUrl[index]" alt="" class="img-fluid mb-3">
                </template>
                <button type="button" class="btn cus-btn-primary w-100 mb-3" @click="addImages">新增</button>
                <button type="button" class="btn cus-btn-outline-primary w-100 mb-3" @click="temp.imagesUrl.pop()">刪除</button>

          
              </div>

            </div>


          </div>
          
        </div>
        <div class="modal-footer">
          <button type="button" class="btn cus-btn-outline-primary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn cus-btn-primary" @click="saveProduct">儲存</button>
        </div>
      </div>
    </div>
  </div>`
})

app.component('delModal',{
    template: `
    <div class="modal" tabindex="-1" id="delModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">刪除產品</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>是否確定刪除這個商品？</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn cus-btn-outline-primary" data-bs-dismiss="modal">取消</button>
        <button type="button" class="btn cus-btn-primary" @click="$emit('del-product')">確定刪除</button>
      </div>
    </div>
  </div>
</div>`
})
app.mount('#app');

