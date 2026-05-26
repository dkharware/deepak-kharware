document.addEventListener('DOMContentLoaded', () => {

    var popup = document.getElementById("product-popup");
    var popupImage = document.getElementById("popup-image");
    var popupTitle = document.getElementById("popup-title");
    var popupPrice = document.getElementById("popup-price");
    var popupDesc = document.getElementById("popup-description");
    var popupVariants = document.getElementById("popup-variants");
    var addToCart = document.getElementById("popup-add-to-cart");

    var currentProduct = null;
    var selectedVariant = null;
    var selectedColor = '';
    var selectedSize = '';

  
    // open popup
    document.querySelectorAll('.js-open-popup').forEach(button => {

        button.addEventListener('click', (e) => {

            var productCard = e.target.closest('.custom-grid_item');

            currentProduct = JSON.parse(
                productCard.dataset.product
            );

            popup.classList.add('active');

            renderPopup(currentProduct);
            renderColors(currentProduct);
            renderSizes(currentProduct);

        });

    });

    // render popup data
    function renderPopup(product) {

        console.log("product",product)

        popupImage.src = product.featured_image;
        popupTitle.innerText = product.title;
        popupDesc.innerHTML = product.description;
        popupPrice.innerText = (product.price / 100).toFixed(2);

        popupVariants.innerHTML = '';

        selectedVariant = product.variants[0];

        product.variants.forEach(variant => {

            var button = document.createElement('button');

            button.classList.add('variant-button');

            button.innerText = variant.title;

            button.addEventListener('click', () => {

                selectedVariant = variant;

            });

            popupVariants.appendChild(button);

        });

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
            ...new Set(product.variants.map(v => v.option1))
        ];

        colors.forEach(color => {

            var button = document.createElement('button');

            button.innerText = color;

            button.classList.add('color-button');

            button.addEventListener('click', () => {

                selectedColor = color;

                updateSelectedVariant();

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

        var sizeSelect = document.getElementById('size-options');

        sizeSelect.innerHTML = '<option value="">Choose your size</option>';

        var sizes = [
            ...new Set(
                product.variants.map(v => v.option2)
            )
        ];

        sizes.forEach(size => {

            var option = document.createElement('option');

            option.value = size;

            option.innerText = size;

            sizeSelect.appendChild(option);

        });

        sizeSelect.addEventListener('change', (e) => {

            selectedSize = e.target.value;
            updateSelectedVariant();

        });

    }

    // update selected variant
    function updateSelectedVariant() {

        selectedVariant = currentProduct.variants.find(v => {
            return (
                v.option1 === selectedColor &&
                v.option2 === selectedSize
            );
        });
        console.log("selectedVariant", selectedVariant);
    }

    

});