let productDOM = document.querySelector('#product')

let shopcar = []
let buttonDOM = []

class mainUI { 
    renderproducts(productList) {
            let uishow = ""
            productList.forEach(element => {
                let {id,product, price, image, alt } = element
                uishow +=  `
                <div class="produflex">
          <div class="prod">
            <div class="produimage">
                <a href="productview.html? id="${id}">
                    <img
                    src="${image}"
                    alt="${alt}">
                </a>
            </div>
            <div class="produfooter">
              <h1>${product}</h1>
            </div>
            <div class="${price}">
              3.25€
            </div>
            <div class="bt ">
                <a href="productview.html? id="${id}" class="btn btn-primary">vista</a>
                <a href="" data-id="${id}" class="btn btn-primary">add to shop car<i class="fa-solid fa-cart-arrow-down"></i></a>
            </div>
          </div>
        </div>`
            });
            productDOM.innerHTML = uishow
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

    const products = await productList.getProducts();
    console.log(products);

})

