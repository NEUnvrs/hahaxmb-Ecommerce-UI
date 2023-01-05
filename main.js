// product_center
const productDOM = document.querySelector('#products')
// carrito_icon
const OpenCart = document.querySelector('.nav_shopcart')
// overlay
const overlay = document.querySelector('.shop_overlay')
const shopDom = document.querySelector('.shopcart')
// shopcart close
const closeCart = document.querySelector('.shopcart_close')
// carritocenter
const cartCenter = document.querySelector('.viewcenter')
// item total
const itemsPopup = document.querySelector('.popupItems')
// removeCart 
const removeCart = document.querySelector('.removeCart')
// carrito total 
const totalitems = document.querySelector('.total_items')

let shopcart = []
let buttonDOM = []

class mainUI {
    renderproducts(productList) {
        let uishow = ""
        productList.forEach((element) => {
            uishow += `
                <div class="produflex">
          <div class="prod">
            <div class="produimage">
                <a href="productview.html? id="${element.id}">
                    <img
                    src="${element.image}"
                    alt="${element.alt}">
                </a>
            </div>
            <div class="produfooter">
              <h1>${element.product}</h1>
            </div>
            <div class="price">
            ${element.price}€
            </div>
            <div class="bt ">
                <a href="productview.html? id=${element.id}" class="btn btn-primary">details</a>
                <a href="" data-id="${element.id}" class="btn btn-primary addcar">add to shop list<i class="fa-solid fa-cart-arrow-down"></i></a>
            </div>
          </div>
        </div>`
        });
        productDOM.innerHTML = uishow
    }

    buttons() {
        const buttons = [...document.querySelectorAll('addcar')];
        buttonDOM = buttons;
        buttons.forEach(button => {
            const id = button.dataset.id;
            const incar = shopcart.find(item => item.id === parseInt(id, 10));
            if (incar) {
                button.innerHTML = "added"
                button.disabled = true
            }
            button.addEventListener("click", statu => {
                statu.preventDefault();
                statu.target.innerHTML = "added"
                statu.disabled = true

                const shopItem = { ...Storage.getProduct(id), quantity: 1 }

                shopcart = [...shopcart, ...shopItem]

                Storage.autoSave(shopcart)

                this.setItemValues(shopcart)
                this.addShopcarItem(shopItem)
            })
        })
    }

    setItemValues(shopcart) {
        let Total = 0;
        let items = 0;
        shopcart.map(item => {
            Total += item.price * item.quantity;
            items += item.quantity;

        });
        totalitems.innerText = parseFloat(Total.toFixed(2));
        itemsPopup.innerText = items
    }

    addShopcarItem({ id, product, price, image, alt }) {
        const div = document.createElement('div');
        div.classList.add('view_item')

        div.innerHTML = `
        <div>
            <img
              src="${image}"
              alt="eat ${alt}">
            <p class="pri">${price}</p>
          </div>
          <div>
            <h3>${product}</h3>

          </div>
          <div class="updown">
            <span class="increase" data-id="${id}"">
              <i class="fa-solid fa-caret-up"></i>
            </span>
            <p class="itemQuantity">1</p>
            <span class="decrease" data-id="${id}">
              <i class="fa-solid fa-caret-down"></i>
            </span>
          </div>
          <div class="elimi" data-id="${id}">
            <i class="fa-regular fa-trash-can"></i>
          </div>`

        cartCenter.appendChild(div)
    }
    show() {
        shopDom.classList.add('show')
        overlay.classList.add('show')
    }
    setAPP() {
        shopcart = Storage.getcart()
        this.setItemValues(shopcart)
        this.populate(shopcart)

        OpenCart.addEventListener("click", this.show)
        closeCart.addEventListener("click", this.hide)
    }
    populate(shopcart) {
        shopcart.forEach(element => this.addShopcarItem(element))
    }
    allcartfunction() {
        removeCart.addEventListener("click", () => {
            this.removeShopcart()
            this.hide()
        })

        cartCenter.addEventListener("click", () => {
            const target = i.target.closest("span")
            const targetElement = target.classList.contains("removeCart")

            if (!target) return
            if (targetElement) {
                const id = parseInt(target.dataset.id)
                this.removeCart(id)
                cartCenter.removeChild(target.parentElement.parentElement)
            }
            else if (target.classList.contains("increase")) {
                const id = parseInt(target.dataset.id, 10)
                let item = shopcart.find(element => element.id === id)
                item.quantity++
                Storage.autoSave(shopcart)
                this.setItemValues(shopcart)
                target.nextElemtsibling.innerText = item.quantity

            }
            else if (target.classList.contains("decrease")) {
                const id = parseInt(target.dataset.id, 10)
                let item = shopcart.find(element => element.id === id)
                item.quantity--

                if (item.quantity > 0) {
                    Storage.autoSave(shopcart)
                    thhis.setItemValues(shopcart)
                    target.previousELementsibling.innerText = item.quantity
                }
            }
            else {
                this.removeCartItem(id);
                cartCenter.removeChild(target.parentElement.parentElement)
            }
        })
    }
    removeShopcart() {
        const cartitems = shopcart.map(element => element.id)
        cartitems.forEach(id => this.removeCartItem(id))

        while (cartCenter.children.length > 0) {
            cartCenter.removeItem(cartCenter.children[0])

        }  
    }

    removeItem(id){
        shopcart = shopcart.filter(element => element.id !== id)
        this.setItemValues(shopcart);
        Storage.autoSave(shopcart)

        let bt = this.singleButton(id);
        if (button) {
            button.disabled = false;
            button.innerText = "add to shop list";
        }
    }

    singleButton(id){
        return buttonDOM.find(button => parseInt(button.dataset.id == id))
    }
    
}



class Storage {
    static saveProduct(obj) {
        localStorage.setItem("products", JSON.stringify(obj))

    }
    static autoSave(data) {
        localStorage.setItem("storage", JSON.stringify(data))
    }
    static getProduct(id) {
        const product = JSON.parse(localStorage.getItem("products"));
        return product.find(product => product.id === parseFloat(id, 10))
    }
    static getcart() {
        return localStorage.getItem("shopcar") ? JSON.parse(localStorage.getItem("shopcar")) : [];
    }
}




class Products {
    async getProducts() {
        try {
            const result = await fetch("products.json");
            const data = await result.json();
            const products = data.allprocducts
            return products
        }
        catch (err) {
            console.log(err);
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const productList = new Products();
    const ui = new mainUI();

    ui.setAPP();

    const products = await productList.getProducts();
    ui.renderproducts(products);
    Storage.saveProduct(products);
    ui.buttons();
    ui.allcartfunction();
})

