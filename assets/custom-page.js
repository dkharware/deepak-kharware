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

    document.querySelectorAll('.js-open-popup').forEach(button => {
        button.addEventListner('click', (e) => {
            const productCard = e.target.closest('.custom-grid__item');
            
        })
    });




    
})