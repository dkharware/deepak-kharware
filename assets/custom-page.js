document.addEventListener('DOMContentLoaded', () => {

    var popup = document.getElementById("product-popup");
    var popupImage = document.getElementById("popup-image");
    var popupTitle = document.getElementById("popup-title");
    var popupPrice = document.getElementById("popup-price");
    var popupDesc = document.getElementById("popup-description");
    var addToCart = document.getElementById("popup-add-to-cart");

    var selectedVariant = null;
    var selectedColor = '';
    var selectedSize = '';

  
    // open popup
    document.querySelectorAll('.js-open-popup').forEach(button => {

        button.addEventListener('click', async (e) => {

            var productCard = e.target.closest('.custom-grid_item');

            var handle = JSON.parse(
                productCard.dataset.product
            );

             try {

            var response = await fetch('/products/' + handle + '.js');
            var product = await response.json();

            popup.classList.add('active');
            renderPopup(product);
            renderSizes(product);
            renderColors(product);


        } catch(error) {

            console.log(error);

        }        

        });

    });

    // close popup button
document.querySelector('.product-popup__close')
.addEventListener('click', () => {

    popup.classList.remove('active');

});


// close popup outside click
popup.addEventListener('click', (e) => {

    // popup inner box
    var popupContent = document.querySelector(
        '.product-popup__content'
    );

    // if clicked outside content
    if (!popupContent.contains(e.target)) {

        popup.classList.remove('active');

    }

});

    // render popup data
    function renderPopup(product) {

        // console.log("product",product)

        popupImage.src = product.featured_image;
        popupTitle.innerText = product.title;
        popupDesc.innerHTML = product.description;
        popupPrice.innerText = (product.price / 100).toFixed(2) + "$";

        selectedVariant = product.variants[0];


    }

    // add to cart
    addToCart.addEventListener('click', async () => {

        if (!selectedVariant) {
            alert("Please select option");
            return;
        }

        await addProduct(selectedVariant.id);
        window.location.href = '/cart';

    });

    // add product function
    async function addProduct(variantId) {

        try {

            await fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: variantId,
                    quantity: 1
                })
            });

        } catch (error) {

            console.error(error);

        }

    }

    // render colors
   function renderColors(product) {

    var colorContainer = document.getElementById('color-options');

    colorContainer.innerHTML = '';

    var colors = [
        ...new Set(product.variants.map(v => v.option2))
    ];

    colors.forEach(color => {

        var button = document.createElement('button');
        var colorDot = document.createElement('span');

        button.classList.add('color-button');
        colorDot.style.backgroundColor = color;
        colorDot.classList.add('color-dot');
        button.appendChild(colorDot);
        button.appendChild(document.createTextNode(color));

        button.addEventListener('click', () => {

            selectedColor = color;
            updateSelectedVariant(product);
            
            document.querySelectorAll('.color-button').forEach(btn => {
                btn.classList.remove('active');
            });

            button.classList.add('active');

        });

        colorContainer.appendChild(button);

    });

}

    // render sizes
    function renderSizes(product) {
        console.log("product size", product);
        

        var sizeOptions = document.getElementById('size-options');
        var arrow = document.querySelector('.custom-arrow');

        var triggerText = document.querySelector(
            '.custom-select-trigger span'
        );

        sizeOptions.innerHTML = '';

        // get unique sizes
        var sizes = [
            ...new Set(
                product.variants.map(v => v.option1)
            )
        ];
 

        // console.log("sizes", sizes);

        sizes.forEach(size => {

            var option = document.createElement('div');

            option.classList.add('custom-option');

            option.innerText = size;

            option.addEventListener('click', () => {

                selectedSize = size;
                // update selected text
                triggerText.innerText = size;
                // close dropdown
                sizeOptions.classList.remove('active');
                arrow.classList.remove('active');

                // update selected variant
                updateSelectedVariant(product);

            });

            sizeOptions.appendChild(option);

        });

        // open close dropdown
        var trigger = document.querySelector(
            '.custom-select-trigger'
        );

        trigger.addEventListener('click', () => {

            sizeOptions.classList.toggle('active');
            arrow.classList.toggle('active');

            

        });

    }

    // update selected variant
    function updateSelectedVariant(product) {

        selectedVariant = product.variants.find( (v) => {
            return (
                v.option2 === selectedColor &&
                v.option1 === selectedSize
            );
        });
        console.log("selectedVariant", selectedVariant);
    }



});