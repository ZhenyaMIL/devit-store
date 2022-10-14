document.addEventListener('DOMContentLoaded', function () {
  const collections = document.querySelectorAll('.wrapper-collections__collection');
  const body = document.querySelector('body');
  const closeButtons = document.querySelectorAll('.close-button');
  const selects = document.querySelectorAll('select.product-options');
  const addToCartCustom = document.querySelectorAll(".add-to-cart");


// Open modal window when click on img collection
  collections.forEach(collection => {
    collection.addEventListener('click', () => {
      let modal = collection.querySelector('.modal-window');

      modal.classList.add('active');
      body.classList.add('overlay');
    })
  });

// Close current modal window after click
  closeButtons.forEach(button => {
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      let currentModal = button.parentNode;

      currentModal.classList.remove('active');
      body.classList.remove('overlay');
    })
  });

// Change product price/image after change select option
  selects.forEach(select => {
    setPriceProduct(select);
    setImgSrc(select);

    select.addEventListener('change', () => {
      setPriceProduct(select);
      setImgSrc(select);
    })
  });

  function setPriceProduct(select) {
    let selectedOption = select.selectedIndex;
    let price = +select.querySelectorAll("option")[`${selectedOption}`].getAttribute('data-price');
    let formattedPrice = `€${price/100}`;
    let currentPrice = select.closest('.product-information').querySelector(".product-information__title p");

    currentPrice.innerHTML = formattedPrice;
  }

  function setImgSrc(select) {
    let selectedOption = select.selectedIndex;
    let optionActiveName = select.querySelectorAll("option")[`${selectedOption}`].innerHTML;
    let imgSrc = select.querySelectorAll("option")[`${selectedOption}`].getAttribute('data-img');
    let currentImg = select.closest('.product-wrapper__products').querySelector(".product-image img");

    if(optionActiveName != 'Default Title') {
      currentImg.setAttribute('src', `${imgSrc}`);
    }
  }

// Adding to cart after click add button
  addToCartCustom.forEach(button => {
    button.addEventListener("click", () => {
      let productId = button.parentNode.querySelector(".form-options .product-options").value;
      let formData = {
        'items': [{
          'id': `${productId}`,
          'quantity': 1
        }]
      };

      fetch(window.Shopify.routes.root + 'cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(response => {
          reactionAfterAdded();
          return response.json();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    })

    function reactionAfterAdded() {
      let cartNumber = +button.getAttribute('data-cart-number');

      cartNumber++
      button.setAttribute('data-cart-number', `${cartNumber}`);
      button.innerHTML = `Added to cart - ${cartNumber}`;

      button.classList.add('successfullyAdded');

      setTimeout(function () {
        button.classList.remove('successfullyAdded');
      }, 450);
    }
  });
});