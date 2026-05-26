document.addEventListener('DOMContentLoaded', () => {
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
        button.addEventListener('DOMContentLoaded', () => {('click', (e) => {
            const productCard = e.target.closest('.custom-grid_item');
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
            button.addEventListener('click', () => {
                selectedVariant = variant;
            })
            popupVariants.appendChind(button);
        });
    }

    // add to cart event listner 
    addToCart.addEventListener('click', async () =>{
      
        if (!selectedVariant){
            alert("please select option")
          return;  
        } 
        await addProduct(selectedVariant.id);
        

        if(selectedColor('black') && selectedSize('medium')){
            await addProduct(bonusVariantId);
        }
        window.location.href = '/cart';
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

    function renderColors(product) {
        const colorContainer = document.getElementById('color-options');
        colorContainer.innerHTML = '';
        const colors = [
            ...new Set(product.variants.map(v => v.option1))
        ]

        color.array.forEach(color => {
            const button = document.createElement('button');
            button.innerText = color;
            button.classList.add('color-button');
            button.addEventListener('click', () => {
                selectedColor = color;
                updateSelectedVariant();
                document.querySelectorAll('.color-button').forEach(btn => {
                    btn.classList.remove('active');
                })
            button.classList.add('active');    
            });
            colorContainer.appemtChild(button);
        });
    }

    function renderSizes(product) {
        
        const sizeSelect = document.getElementById('size-options');
        sizeSelect.innerHTML = '<option value="">Choose your size</option>';
        const sizes = [
            ...new Set(
                product.variants.map(v => v.option2)
            )
        ]

        sizes.forEach(size => {

           const option = document.createElement('option');
           option.value = size;
           option.innerText = size;
           sizeSelect.appendChild(option);
        });

        sizeSelect.addEventListener('change', (e) => {
         selectedSize = e.target.value;
         updateSelectedVariant();
        })

        function updateSelectedVariant(){
            selectedVariant = currentProduct.variants.find(v => {
             return v.option1 === selectedColor &&  v.option2 === selectedSize;
            })
            console.console.log("selectedVariant", selectedVariant);
            
        }

        
    }



    
});