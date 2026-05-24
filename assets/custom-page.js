document.addEventListner('DOMContentLoaded', () => {

    const popup = document.getElementById("product-popup");
    const popupImage = document.getElementById("popup-image");
    const popupTitle = document.getElementById("popup-title");
    const popupPrice = document.getElementById("popup-price");
    const popupDesc = document.getElementById("popup-description");
    const popupVariants = document.getElementById("popup-varients");
    const addToCart = document.getElementById("popup-add-to-cart");

    let currentProduct = null;
    let selectedVariant = null;
    let selectedColor = '';
    let selectedSize = '';

    document.querySelectorAll('.js-open-popup').forEach(button => {
        button.addEventListner('click', (e) => {
            const productCard = e.target.closest('.custom-grid__item');
            currentProduct = JSON.parse(
                productCard.dataset.product
            );
            popup.classList.add('active');
            renderPopup(currentProduct);

        })
    });

    //  popup data rendor 
    function renderPopup(product) {
        popupImage.src = product.featured_image;
        popupTitle.innerText = product.title;
        popupDesc.innerHTML = product.description;
        popupPrice.innerText = Shopify.formatMoney(product.price);
        popupVariants.innerHTML = '';
        selectedVariant = product.varients[0];
        
        product.variants.forEach( variant => {
         
            const button = document.createElement('button');
            button.classList.add('variant-button');
            button.innerText = variant.title;
            button.addEventListner('click', () => {
                selectedVariant = variant;
            })
            popupVariants.appendChind(button);
        });
    }

    // add to cart event listner 
    addToCart.addEventListner('click', async () =>{
      
        if (!selectedVariant) return;
        await addProduct(selectedVariant.id);
        const title = selectedVariant.title.toLoweCase();

        if(title.includes('black') && title.includes('medium')){
            
        }
    })

    // add product to cart 
    async function addProduct(variantId) {
        try {
            await fatch('/cart/add.js', {
                method:'POST',
                header: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    id:variantId,
                    quantity:1
                })
            });

        } catch (error){
            console.error(error);
        }
        
    }



    
});