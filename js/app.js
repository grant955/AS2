/**
*Student Full Name: Grant Jefferie Morgan Castle
*Student ID No: 5096925
*Course: BIT703 Web Technologies 
*BIT703 Web Technologies Assessment 2

 * 1. Featured Products Carousel (Bootstrap)
 * 2. Floating Back-to-Top button
 * 3. Free Shipping over $600 (Shipping page)
 * 4. Cart management, quantity controls, dynamic totals, Add to Cart
 * + Client-side form validation (NZ postcode, payment, quantities)
 */

(function () {
  "use strict";

  /* =====================================================
     CART STORAGE (localStorage so pages share state)
     ===================================================== */
  const CART_KEY = "aag_cart";
  const TAX_RATE = 0.0217; // approximate to match wireframe $13 on $600

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
  }

  function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = count > 0 ? `(${count})` : "";
    });
  }

  /* Sample product catalogue (used by Add to Cart & display) */
  const PRODUCTS = {
    "hiking-boots": { id: "hiking-boots", name: "Alpine Hiking Boots", price: 300, image: "assets/images/hiking-boots.png", desc: "Waterproof leather boots for rugged NZ trails." },
    "backpack": { id: "backpack", name: "Trailblazer 65L Pack", price: 300, image: "assets/images/backpack.png", desc: "Lightweight multi-day backpack with rain cover." },
    "tent": { id: "tent", name: "Southern Cross 2-Person Tent", price: 300, image: "assets/images/tent.png", desc: "Four-season tent built for alpine conditions." },
    "jacket": { id: "jacket", name: "StormShield Shell Jacket", price: 300, image: "assets/images/jacket.png", desc: "Breathable waterproof shell for unpredictable weather." },
    "sleeping-bag": { id: "sleeping-bag", name: "Kiwi Down Sleeping Bag", price: 300, image: "assets/images/sleeping-bag.png", desc: "Comfort rated to -5°C for mountain nights." },
    "hiking-poles": { id: "hiking-poles", name: "Carbon Fibre Hiking Poles", price: 300, image: "assets/images/hiking-poles.png", desc: "Lightweight adjustable poles with cork grips." },
    "water-bottle": { id: "water-bottle", name: "Insulated Water Bottle 1L", price: 300, image: "assets/images/water-bottle.png", desc: "Keeps drinks cold for 24 hrs on the trail." },
    "headlamp": { id: "headlamp", name: "NightTrail Headlamp", price: 300, image: "assets/images/headlamp.png", desc: "300 lumen rechargeable headlamp." },
    "camp-stove": { id: "camp-stove", name: "Compact Camp Stove", price: 300, image: "assets/images/camp-stove.png", desc: "Fast-boil titanium stove for backpackers." },
    "rope": { id: "rope", name: "Dynamic Climbing Rope 60m", price: 300, image: "assets/images/rope.png", desc: "UIAA certified single rope for multi-pitch routes." }
  };

  /* =====================================================
     1. FLOATING BACK-TO-TOP (Home page primarily)
     ===================================================== */
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
    });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =====================================================
     2. ADD TO CART (Product Detail page)
     ===================================================== */
  function initAddToCart() {
    const btn = document.getElementById("addToCartBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId || "hiking-boots";
      const product = PRODUCTS[productId] || PRODUCTS["hiking-boots"];
      const modelSelect = document.getElementById("modelSelect");
      const model = modelSelect ? modelSelect.value : "Standard";

      let cart = getCart();
      const existing = cart.find((item) => item.id === product.id && item.model === model);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          desc: product.desc,
          model: model,
          qty: 1
        });
      }
      saveCart(cart);

      // Visual feedback
      const original = btn.textContent;
      btn.textContent = "Added ✓";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 1500);
    });
  }

  /* =====================================================
     3. CART PAGE – quantity controls & dynamic totals
     ===================================================== */
  function calcTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal > 600 ? 0 : (window.selectedShippingCost || 0);
    const taxes = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = subtotal + shipping + taxes;
    return { subtotal, shipping, taxes, total };
  }

  function renderCartPage() {
    const container = document.getElementById("cartItems");
    if (!container) return;

    let cart = getCart();
    if (cart.length === 0) {
      // Seed with two sample items so the page matches the wireframe on first visit
      cart = [
        { id: "hiking-boots", name: "Alpine Hiking Boots", price: 300, image: "assets/images/hiking-boots.png", desc: "Waterproof leather boots for rugged NZ trails.", model: "Standard", qty: 1 },
        { id: "backpack", name: "Trailblazer 65L Pack", price: 300, image: "assets/images/backpack.png", desc: "Lightweight multi-day backpack with rain cover.", model: "Standard", qty: 1 }
      ];
      saveCart(cart);
    }

    container.innerHTML = "";
    cart.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "cart-item row align-items-center";
      row.innerHTML = `
        <div class="col-3 col-md-2">
          <img src="${item.image}" alt="${item.name}" class="img-fluid">
        </div>
        <div class="col-5 col-md-5">
          <div class="fw-medium">${item.name}</div>
          <small class="text-muted">${item.desc}</small>
          <div class="mt-1">$${item.price.toFixed(0)}</div>
        </div>
        <div class="col-4 col-md-3">
          <div class="input-group input-group-sm" style="max-width:110px">
            <button class="btn btn-outline-secondary qty-minus" data-index="${index}" type="button">−</button>
            <input type="number" class="form-control text-center qty-input" value="${item.qty}" min="1" max="99" data-index="${index}">
            <button class="btn btn-outline-secondary qty-plus" data-index="${index}" type="button">+</button>
          </div>
        </div>
      `;
      container.appendChild(row);
    });

    // Quantity event listeners
    container.querySelectorAll(".qty-minus").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        let cart = getCart();
        if (cart[idx].qty > 1) {
          cart[idx].qty -= 1;
          saveCart(cart);
          renderCartPage();
          updateSummary();
        }
      });
    });
    container.querySelectorAll(".qty-plus").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        let cart = getCart();
        if (cart[idx].qty < 99) {
          cart[idx].qty += 1;
          saveCart(cart);
          renderCartPage();
          updateSummary();
        }
      });
    });
    container.querySelectorAll(".qty-input").forEach((input) => {
      input.addEventListener("change", () => {
        const idx = parseInt(input.dataset.index, 10);
        let val = parseInt(input.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 99) val = 99;
        let cart = getCart();
        cart[idx].qty = val;
        saveCart(cart);
        renderCartPage();
        updateSummary();
      });
    });

    updateSummary();
  }

  function updateSummary() {
    const cart = getCart();
    const { subtotal, shipping, taxes, total } = calcTotals(cart);

    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = typeof val === "number" ? `$${val.toFixed(0)}` : val;
    };

    set("summarySubtotal", subtotal);
    set("summaryShipping", shipping === 0 ? "FREE" : shipping);
    set("summaryTaxes", taxes);
    set("summaryTotal", total);

    // Also update any shipping-page product list prices if present
    const shipList = document.getElementById("shippingProductList");
    if (shipList) {
      shipList.innerHTML = cart.map(item => `
        <div class="d-flex align-items-center mb-2">
          <img src="${item.image}" alt="" width="50" height="50" class="me-2 border">
          <div>
            <div class="small">${item.name}</div>
            <div class="fw-medium">$${item.price}</div>
          </div>
        </div>
      `).join("");
    }
  }

  /* =====================================================
     4. FREE SHIPPING OVER $600 (Shipping Details page)
     ===================================================== */
  function initShippingPage() {
    const freeOpt = document.getElementById("shipFree");
    const nextDayOpt = document.getElementById("shipNextDay");
    if (!freeOpt || !nextDayOpt) return;

    window.selectedShippingCost = 0; // default free option selected in wireframe

    function applyShippingLogic() {
      const cart = getCart();
      const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

      if (subtotal > 600) {
        // Force free shipping
        freeOpt.checked = true;
        nextDayOpt.disabled = true;
        freeOpt.closest(".shipping-option").classList.add("selected");
        nextDayOpt.closest(".shipping-option").classList.remove("selected");
        window.selectedShippingCost = 0;
        // Update label to show it is free because of order value
        const freeLabel = document.getElementById("freeShippingLabel");
        if (freeLabel) freeLabel.innerHTML = `Free Shipping<br><small class="text-success">Order over $600 – shipping is free</small>`;
      } else {
        nextDayOpt.disabled = false;
        const freeLabel = document.getElementById("freeShippingLabel");
        if (freeLabel) freeLabel.innerHTML = `Free Shipping<br><small class="text-muted">Between 2 – 5 working days</small>`;
        window.selectedShippingCost = freeOpt.checked ? 0 : 20;
      }
      updateSummary();
    }

    freeOpt.addEventListener("change", () => {
      if (freeOpt.checked) {
        window.selectedShippingCost = 0;
        freeOpt.closest(".shipping-option").classList.add("selected");
        nextDayOpt.closest(".shipping-option").classList.remove("selected");
        updateSummary();
      }
    });
    nextDayOpt.addEventListener("change", () => {
      if (nextDayOpt.checked) {
        window.selectedShippingCost = 20;
        nextDayOpt.closest(".shipping-option").classList.add("selected");
        freeOpt.closest(".shipping-option").classList.remove("selected");
        updateSummary();
      }
    });

    // Initial run
    applyShippingLogic();
    // Re-check if cart changes (rare on this page but safe)
    window.addEventListener("storage", applyShippingLogic);
  }

  /* =====================================================
     FORM VALIDATION (Shipping + Payment)
     ===================================================== */
  function validateNZPostcode(value) {
    // NZ postcodes are 4 digits
    return /^\d{4}$/.test(value.trim());
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function validateCardNumber(value) {
    const cleaned = value.replace(/\s+/g, "");
    return /^\d{13,19}$/.test(cleaned);
  }

  function validateExpiry(value) {
    // MM/YY
    if (!/^\d{2}\/\d{2}$/.test(value)) return false;
    const [mm, yy] = value.split("/").map(Number);
    if (mm < 1 || mm > 12) return false;
    const now = new Date();
    const exp = new Date(2000 + yy, mm); // first day of next month
    return exp > now;
  }

  function validateCVV(value) {
    return /^\d{3,4}$/.test(value.trim());
  }

  function showError(input, message) {
    input.classList.add("is-invalid");
    let feedback = input.nextElementSibling;
    if (!feedback || !feedback.classList.contains("invalid-feedback")) {
      feedback = document.createElement("div");
      feedback.className = "invalid-feedback";
      input.parentNode.appendChild(feedback);
    }
    feedback.textContent = message;
    feedback.style.display = "block";
  }

  function clearError(input) {
    input.classList.remove("is-invalid");
    const feedback = input.nextElementSibling;
    if (feedback && feedback.classList.contains("invalid-feedback")) {
      feedback.style.display = "none";
    }
  }

  function initShippingValidation() {
    const form = document.getElementById("shippingForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      const firstName = document.getElementById("firstName");
      const lastName = document.getElementById("lastName");
      const address = document.getElementById("address");
      const city = document.getElementById("city");
      const postcode = document.getElementById("postcode");
      const phone = document.getElementById("phone");
      const country = document.getElementById("country");

      [firstName, lastName, address, city, postcode, phone, country].forEach(clearError);

      if (!firstName.value.trim()) { showError(firstName, "First name is required"); valid = false; }
      if (!lastName.value.trim()) { showError(lastName, "Last name is required"); valid = false; }
      if (!address.value.trim()) { showError(address, "Address is required"); valid = false; }
      if (!city.value.trim()) { showError(city, "City is required"); valid = false; }
      if (!country.value) { showError(country, "Please select a country"); valid = false; }

      if (!postcode.value.trim()) {
        showError(postcode, "Postal code is required");
        valid = false;
      } else if (!validateNZPostcode(postcode.value)) {
        showError(postcode, "Enter a valid New Zealand 4-digit postcode");
        valid = false;
      }

      if (!phone.value.trim()) {
        showError(phone, "Phone number is required");
        valid = false;
      } else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(phone.value)) {
        showError(phone, "Enter a valid phone number");
        valid = false;
      }

      if (valid) {
        // Proceed to payment
        window.location.href = "payment.html";
      }
    });
  }

  function initPaymentValidation() {
    const form = document.getElementById("paymentForm");
    if (!form) return;

    const creditRadio = document.getElementById("payCredit");
    const paypalRadio = document.getElementById("payPaypal");
    const creditFields = document.getElementById("creditCardFields");

    function toggleFields() {
      if (creditRadio && creditRadio.checked) {
        creditFields.style.display = "block";
        creditRadio.closest(".payment-method").classList.add("selected");
        paypalRadio.closest(".payment-method").classList.remove("selected");
      } else {
        creditFields.style.display = "none";
        paypalRadio.closest(".payment-method").classList.add("selected");
        creditRadio.closest(".payment-method").classList.remove("selected");
      }
    }
    if (creditRadio) creditRadio.addEventListener("change", toggleFields);
    if (paypalRadio) paypalRadio.addEventListener("change", toggleFields);
    toggleFields();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      if (creditRadio && creditRadio.checked) {
        const cardNum = document.getElementById("cardNumber");
        const expiry = document.getElementById("cardExpiry");
        const cvv = document.getElementById("cardCvv");
        const holder = document.getElementById("cardHolder");

        [cardNum, expiry, cvv, holder].forEach(clearError);

        if (!cardNum.value.trim() || !validateCardNumber(cardNum.value)) {
          showError(cardNum, "Enter a valid card number (13–19 digits)");
          valid = false;
        }
        if (!expiry.value.trim() || !validateExpiry(expiry.value)) {
          showError(expiry, "Enter a valid future expiry (MM/YY)");
          valid = false;
        }
        if (!cvv.value.trim() || !validateCVV(cvv.value)) {
          showError(cvv, "Enter a valid 3 or 4 digit CVV");
          valid = false;
        }
        if (!holder.value.trim()) {
          showError(holder, "Card holder name is required");
          valid = false;
        }
      }

      if (valid) {
        alert("Thank you! Your order has been placed successfully.\n(This is a demonstration – no real payment processed.)");
        localStorage.removeItem(CART_KEY);
        window.location.href = "index.html";
      }
    });
  }

  /* Newsletter simple validation */
  function initNewsletter() {
    document.querySelectorAll(".newsletter-form").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]');
        if (!email.value.trim() || !validateEmail(email.value)) {
          email.classList.add("is-invalid");
          alert("Please enter a valid email address.");
          return;
        }
        email.classList.remove("is-invalid");
        alert("Thanks for subscribing to Aotearoa Adventure Gear updates!");
        form.reset();
      });
    });
  }

  /* =====================================================
     INIT ON DOM READY
     ===================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    initBackToTop();
    initAddToCart();
    renderCartPage();
    initShippingPage();
    initShippingValidation();
    initPaymentValidation();
    initNewsletter();

    // Make sure Bootstrap carousel is initialised if present
    const carouselEl = document.getElementById("featuredCarousel");
    if (carouselEl && typeof bootstrap !== "undefined") {
      new bootstrap.Carousel(carouselEl, { interval: 5000, wrap: true });
    }
  });
})();
