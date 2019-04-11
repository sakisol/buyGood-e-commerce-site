//buygood.js

//register the component and give it a name
//Vue.component('product', {
//    template: ``
//})


//create a new vue instance
//you pass options object into it
//used to store optional properties that are... 
//...used to store data and perform actions
    var app = new Vue({
      el: '#app',
      data: {
        onSale: true,
        brand: 'Vue Mastery',
        product: 'Socks',
        description: 'A pair of warm, fuzzy socks',
//        image: './img/socks.jpg',
        selectedVariant: 0, //zero because it wll be set to an index (that is hovered on)
//        inStock: true, //conditional rendering
//          inventory: 100 /renders "in stock"
//        inventory: 8 //renders "almost sold out"
//           inventory:0//renders "out of stock"
//          onSale: false
          details: ["80% cotton", "20% poly", "Gender-neutral"],
          
          variants: [
              {
                  variantId: 2234,
                  variantColor: "green",
                  variantImage: "./img/socks.jpg",
                  variantQuantity: 10
              }, 
              {
                  variantId: 2235,
                  variantColor: "blue",
                    variantImage: "./img/dinosocks.jpg",
                   variantQuantity: 0
              }
          ],
          
          sizes: ["4-6", "7-9", "10-13"],
          cart: 0 
      },
        methods: {
            //can also write it using ES6 shorthand addToCart() remove ":function"
            addToCart: function (){
                this.cart += 1
            },
            
            removeFromCart: function(){
                this.cart -= 1
            },
            //can also write it using ES6 shorthand updateProduct()
            updateProduct: function (index){
                this.selectedVariant = index
//                console.log(index)//returns 0 or 1
            } 
        },
        computed: {
         title () {
            return this.brand + ' ' + this.product
         },
            image (){
            return this.variants[this.selectedVariant].variantImage
            },
            inStock (){
                return this.variants[this.selectedVariant].variantQuantity
            },
            
            sale () {
                if (this.onSale){
                    return this.brand + ' ' + this.product + ' ' + 'are on Sale Now!' 
                }
                    return this.brand + ' ' + this.product + ' ' + 'are NOT on Sale!' 
            }
            
                 }//end of computed

    })

 
