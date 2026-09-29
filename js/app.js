(function () {
  "use strict";

  var STORAGE_CART = "kantin_shodap_nieh_cart";
  var STORAGE_TX = "kantin_shodap_nieh_last_transaction";
  var STORAGE_REWARD = "kantin_shodap_nieh_quiz_reward";
  var STORAGE_TX_LIST = "kantin_shodap_nieh_transactions";

  var state = {
    view: "home",
    search: "",
    category: "Semua",
    sort: "default",
    cart: [],
    customerName: "",
    paymentMethod: null,
    cashAmount: 0,
    voucher: null,
    quizIndex: 0,
    quizScore: 0,
    quizChoice: null,
    quizStarted: false,
    quizFinished: false,
    selectedProduct: null
  };

  var toastTimer = null;

  function $(id) {
    return document.getElementById(id);
  }

  function formatRupiah(n) {
    var value = Math.max(0, Math.round(Number(n) || 0));
    return "Rp" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function getProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  function cartCount() {
    var n = 0;
    for (var i = 0; i < state.cart.length; i++) n += state.cart[i].quantity;
    return n;
  }

  function calculateSubtotal() {
    var sum = 0;
    for (var i = 0; i < state.cart.length; i++) {
      var p = getProduct(state.cart[i].productId);
      if (p) sum += p.price * state.cart[i].quantity;
    }
    return sum;
  }

  function discountAmount() {
    var sub = calculateSubtotal();
    if (!state.voucher) return 0;
    if (state.voucher.type === "percentage") {
      return Math.floor(sub * (state.voucher.value / 100));
    }
    return Math.min(sub, state.voucher.value);
  }

  function calculateTotal() {
    return Math.max(0, calculateSubtotal() - discountAmount());
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_CART, JSON.stringify(state.cart));
    } catch (e) {}
  }

  function loadCart() {
    try {
      var raw = localStorage.getItem(STORAGE_CART);
      if (raw) state.cart = JSON.parse(raw) || [];
    } catch (e) {
      state.cart = [];
    }
  }

  function saveReward() {
    try {
      localStorage.setItem(STORAGE_REWARD, JSON.stringify(state.voucher));
    } catch (e) {}
  }

  function loadReward() {
    try {
      var raw = localStorage.getItem(STORAGE_REWARD);
      if (raw) state.voucher = JSON.parse(raw);
    } catch (e) {}
  }

  function saveTransaction(tx) {
    try {
      localStorage.setItem(STORAGE_TX, JSON.stringify(tx));
      var list = [];
      var raw = localStorage.getItem(STORAGE_TX_LIST);
      if (raw) list = JSON.parse(raw) || [];
      list.push(tx);
      localStorage.setItem(STORAGE_TX_LIST, JSON.stringify(list));
    } catch (e) {}
  }

  function findTransaction(id) {
    try {
      var last = JSON.parse(localStorage.getItem(STORAGE_TX) || "null");
      if (last && last.id === id) return last;
      var list = JSON.parse(localStorage.getItem(STORAGE_TX_LIST) || "[]");
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) return list[i];
      }
    } catch (e) {}
    return null;
  }

  function showNotification(message, type) {
    var el = $("toast");
    el.textContent = message;
    el.className = "toast is-show " + (type || "info");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove("is-show");
    }, 2800);
  }

  function setView(name) {
    var allowed = {
      home: 1, menu: 1, budget: 1, event: 1, cart: 1,
      checkout: 1, payment: 1, receipt: 1, about: 1
    };
    if (!allowed[name]) name = "home";
    state.view = name;
    var views = document.querySelectorAll(".view");
    for (var i = 0; i < views.length; i++) {
      views[i].classList.toggle("is-active", views[i].id === "view-" + name);
    }
    var navs = document.querySelectorAll("[data-nav]");
    for (var n = 0; n < navs.length; n++) {
      var btn = navs[n];
      if (btn.classList.contains("brand") || btn.classList.contains("header-cart")) continue;
      btn.classList.toggle("is-active", btn.getAttribute("data-nav") === name);
    }
    window.scrollTo(0, 0);
    if (name === "menu") renderProducts();
    if (name === "cart") renderCart();
    if (name === "checkout") renderCheckout();
    if (name === "budget" && !$("budgetResults").innerHTML) renderBudgetIdle();
    if (name === "event") renderQuiz();
    if (name === "home") renderHome();
    if (name === "about") renderAbout();
  }

  function filteredProducts() {
    var q = state.search.trim().toLowerCase();
    var list = [];
    for (var i = 0; i < PRODUCTS.length; i++) {
      var p = PRODUCTS[i];
      if (state.category !== "Semua" && p.category !== state.category) continue;
      if (q && p.name.toLowerCase().indexOf(q) === -1 && p.category.toLowerCase().indexOf(q) === -1) continue;
      list.push(p);
    }
    if (state.sort === "price-asc") list.sort(function (a, b) { return a.price - b.price; });
    if (state.sort === "price-desc") list.sort(function (a, b) { return b.price - a.price; });
    if (state.sort === "name") list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    return list;
  }

  function productCard(p, compact) {
    var badges = "";
    if (!p.available) badges += '<span class="badge danger">Habis</span>';
    else if (p.isBestSeller) badges += '<span class="badge">BEST SELLER</span>';
    else if (p.isNew) badges += '<span class="badge muted">Baru</span>';
    var cta = p.available
      ? '<button class="btn btn-primary btn-block" type="button" data-add="' + p.id + '">Tambah</button>'
      : '<button class="btn btn-block" type="button" disabled>Habis</button>';
    return (
      '<article class="product-card' + (p.available ? "" : " is-sold") + '">' +
        '<button type="button" data-detail="' + p.id + '" style="border:0;background:none;padding:0;text-align:left">' +
          '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" width="400" height="400">' +
        "</button>" +
        '<div class="product-body">' +
          '<div class="product-meta"><span>' + p.category + "</span>" + badges + "</div>" +
          "<h3>" + p.name + "</h3>" +
          '<div class="price">' + formatRupiah(p.price) + "</div>" +
          (compact ? "" : cta) +
        "</div>" +
      "</article>"
    );
  }

  function renderProducts() {
    var list = filteredProducts();
    var grid = $("productGrid");
    var empty = $("menuEmpty");
    $("menuResultCount").textContent = list.length + " menu";
    if (!list.length) {
      grid.innerHTML = "";
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    var html = "";
    for (var i = 0; i < list.length; i++) html += productCard(list[i], false);
    grid.innerHTML = html;
  }

  function renderHome() {
    var row = $("bestSellerRow");
    var html = "";
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].isBestSeller) html += productCard(PRODUCTS[i], false);
    }
    row.innerHTML = html;
    $("homeCanteenInfo").textContent = CANTEEN_INFO.location + " · " + CANTEEN_INFO.hours;
  }

  function renderAbout() {
    $("aboutName").textContent = CANTEEN_INFO.name;
    $("aboutLocation").textContent = CANTEEN_INFO.location;
    $("aboutHours").textContent = CANTEEN_INFO.hours;
    $("aboutContact").textContent = CANTEEN_INFO.contact;
    $("aboutNote").textContent = CANTEEN_INFO.note;
  }

  function updateCartBadge() {
    var el = $("cartCount");
    var n = cartCount();
    el.hidden = n === 0;
    el.textContent = String(n);
    el.classList.remove("is-pop");
    void el.offsetWidth;
    el.classList.add("is-pop");
  }

  function addToCart(productId, qty) {
    var p = getProduct(productId);
    if (!p || !p.available) {
      showNotification("Menu lagi habis.", "error");
      return;
    }
    qty = qty || 1;
    var found = null;
    for (var i = 0; i < state.cart.length; i++) {
      if (state.cart[i].productId === productId) found = state.cart[i];
    }
    if (found) found.quantity += qty;
    else state.cart.push({ productId: productId, quantity: qty });
    saveCart();
    updateCartBadge();
    showNotification(p.name + " ditambahkan ke keranjang.", "success");
    if (state.view === "cart") renderCart();
  }

  function removeFromCart(productId) {
    var next = [];
    for (var i = 0; i < state.cart.length; i++) {
      if (state.cart[i].productId !== productId) next.push(state.cart[i]);
    }
    state.cart = next;
    saveCart();
    updateCartBadge();
    renderCart();
  }

  function increaseQuantity(productId) {
    for (var i = 0; i < state.cart.length; i++) {
      if (state.cart[i].productId === productId) state.cart[i].quantity += 1;
    }
    saveCart();
    updateCartBadge();
    renderCart();
  }

  function decreaseQuantity(productId) {
    for (var i = 0; i < state.cart.length; i++) {
      if (state.cart[i].productId === productId) {
        if (state.cart[i].quantity <= 1) {
          removeFromCart(productId);
          return;
        }
        state.cart[i].quantity -= 1;
      }
    }
    saveCart();
    updateCartBadge();
    renderCart();
  }

  function renderCart() {
    var list = $("cartList");
    var empty = $("cartEmpty");
    var summary = $("cartSummary");
    var clearBtn = $("clearCartBtn");
    if (!state.cart.length) {
      list.innerHTML = "";
      empty.hidden = false;
      summary.hidden = true;
      clearBtn.hidden = true;
      return;
    }
    empty.hidden = true;
    summary.hidden = false;
    clearBtn.hidden = false;
    var html = "";
    for (var i = 0; i < state.cart.length; i++) {
      var item = state.cart[i];
      var p = getProduct(item.productId);
      if (!p) continue;
      html +=
        '<article class="cart-item">' +
          '<img src="' + p.image + '" alt="' + p.name + '">' +
          "<div><strong>" + p.name + "</strong><div class='price'>" + formatRupiah(p.price) + "</div>" +
          '<div class="qty">' +
            '<button type="button" data-dec="' + p.id + '" aria-label="Kurangi">−</button>' +
            "<span>" + item.quantity + "</span>" +
            '<button type="button" data-inc="' + p.id + '" aria-label="Tambah">+</button>' +
          "</div></div>" +
          '<button class="icon-btn" type="button" data-remove="' + p.id + '" aria-label="Hapus">✕</button>' +
        "</article>";
    }
    list.innerHTML = html;
    var n = cartCount();
    $("cartItemCount").textContent = n + " item";
    $("cartSubtotal").textContent = formatRupiah(calculateSubtotal());
    $("cartDiscount").textContent = "-" + formatRupiah(discountAmount());
    $("cartTotal").textContent = formatRupiah(calculateTotal());
  }

  function renderCheckout() {
    if (!state.cart.length) {
      showNotification("Keranjangmu masih kosong.", "warning");
      setView("cart");
      return;
    }
    var html = "";
    for (var i = 0; i < state.cart.length; i++) {
      var p = getProduct(state.cart[i].productId);
      if (!p) continue;
      html += "<div class='summary-row'><span>" + p.name + " × " + state.cart[i].quantity + "</span><span>" + formatRupiah(p.price * state.cart[i].quantity) + "</span></div>";
    }
    $("checkoutItems").innerHTML = html;
    $("coSubtotal").textContent = formatRupiah(calculateSubtotal());
    $("coDiscount").textContent = "-" + formatRupiah(discountAmount());
    $("coTotal").textContent = formatRupiah(calculateTotal());
    $("customerName").value = state.customerName;
    $("voucherCode").value = state.voucher ? state.voucher.code : "";
    var cards = document.querySelectorAll(".pay-card");
    for (var c = 0; c < cards.length; c++) {
      cards[c].classList.toggle("is-active", cards[c].getAttribute("data-pay") === state.paymentMethod);
    }
  }

  function applyDiscount() {
    var code = $("voucherCode").value.trim().toUpperCase();
    $("voucherError").hidden = true;
    if (!code) {
      $("voucherError").textContent = "Voucher ini tidak dapat digunakan.";
      $("voucherError").hidden = false;
      return;
    }
    var stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_REWARD) || "null");
    } catch (e) {}
    if (!stored || stored.code !== code) {
      $("voucherError").textContent = "Voucher ini tidak dapat digunakan.";
      $("voucherError").hidden = false;
      showNotification("Voucher ini tidak dapat digunakan.", "error");
      return;
    }
    state.voucher = stored;
    saveReward();
    renderCheckout();
    showNotification("Voucher " + code + " diterapkan.", "success");
  }

  function checkout() {
    $("nameError").hidden = true;
    $("payError").hidden = true;
    if (!state.cart.length) {
      showNotification("Keranjangmu masih kosong.", "warning");
      setView("cart");
      return false;
    }
    var name = $("customerName").value.trim();
    if (!name) {
      $("nameError").hidden = false;
      showNotification("Nama perlu diisi sebelum lanjut.", "error");
      return false;
    }
    if (!state.paymentMethod) {
      $("payError").hidden = false;
      showNotification("Pilih metode pembayaran dulu.", "error");
      return false;
    }
    state.customerName = name;
    return true;
  }

  function openPayment() {
    if (!checkout()) return;
    setView("payment");
    var total = calculateTotal();
    $("paymentTotalLabel").textContent = "Total " + formatRupiah(total) + " · simulasi pembayaran";
    var cash = state.paymentMethod === "cash";
    $("cashPanel").hidden = !cash;
    $("qrisPanel").hidden = cash;
    $("paymentTitle").textContent = cash ? "Bayar tunai" : "Simulasi QRIS";
    $("cashError").hidden = true;
    $("cashHint").textContent = "";
    $("qrisStatus").textContent = "Menunggu pembayaran";
  }

  function processCashPayment() {
    var total = calculateTotal();
    var paid = Number($("cashInput").value);
    $("cashError").hidden = true;
    if (!paid && paid !== 0) {
      $("cashError").textContent = "Masukkan nominal uang.";
      $("cashError").hidden = false;
      return;
    }
    if (paid < total) {
      var less = total - paid;
      $("cashError").textContent = "Uang yang dibayar masih kurang " + formatRupiah(less) + ".";
      $("cashError").hidden = false;
      showNotification("Uang yang dibayar masih kurang " + formatRupiah(less) + ".", "error");
      return;
    }
    var change = paid - total;
    $("cashHint").innerHTML = '<span class="change-ok">Kembalian ' + formatRupiah(change) + "</span>";
    finishPayment("cash", paid, change);
  }

  function processQRISPayment() {
    var btn = $("simulateQris");
    btn.disabled = true;
    $("qrisStatus").textContent = "Memproses simulasi...";
    setTimeout(function () {
      if (Math.random() < 0.08) {
        $("qrisStatus").textContent = "Pembayaran belum berhasil. Coba simulasi lagi.";
        showNotification("Pembayaran belum berhasil. Coba simulasi lagi.", "error");
        btn.disabled = false;
        return;
      }
      $("qrisStatus").textContent = "Simulasi pembayaran berhasil.";
      finishPayment("qris", calculateTotal(), 0);
      btn.disabled = false;
    }, 900);
  }

  function nextTxId() {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    var seq = 1;
    try {
      var list = JSON.parse(localStorage.getItem(STORAGE_TX_LIST) || "[]");
      seq = list.length + 1;
    } catch (e) {}
    var pad = String(seq).padStart(3, "0");
    return "TRX-" + y + m + day + "-" + pad;
  }

  function generateReceipt(payment) {
    var items = [];
    for (var i = 0; i < state.cart.length; i++) {
      var p = getProduct(state.cart[i].productId);
      if (!p) continue;
      items.push({
        productId: p.id,
        name: p.name,
        price: p.price,
        quantity: state.cart[i].quantity
      });
    }
    var tx = {
      id: nextTxId(),
      date: new Date().toISOString(),
      customer: { name: state.customerName },
      items: items,
      subtotal: calculateSubtotal(),
      discount: discountAmount(),
      total: calculateTotal(),
      payment: payment
    };
    saveTransaction(tx);
    state.cart = [];
    saveCart();
    updateCartBadge();
    return tx;
  }

  function playPaymentCelebration() {
    burstConfetti();

    var overlay = $("paymentCelebration");
    if (overlay) {
      overlay.hidden = false;
      overlay.setAttribute("aria-hidden", "false");
      overlay.classList.remove("is-show");
      void overlay.offsetWidth;
      overlay.classList.add("is-show");
      setTimeout(function () {
        overlay.classList.remove("is-show");
        setTimeout(function () {
          overlay.hidden = true;
          overlay.setAttribute("aria-hidden", "true");
        }, 220);
      }, 1500);
    }

    var audio = $("paymentSuccessAudio");
    if (audio) {
      try {
        audio.currentTime = 0;
        var playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            // Browser autoplay policy may block audio, especially after delayed QRIS flow.
          });
        }
      } catch (e) {}
    }
  }

  function finishPayment(method, paid, change) {
    var tx = generateReceipt({
      method: method,
      paidAmount: paid,
      change: change,
      status: "success"
    });
    playPaymentCelebration();
    showNotification("Simulasi pembayaran berhasil.", "success");
    renderReceipt(tx);
    setView("receipt");
  }

  function hashBits(str) {
    var bits = [];
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    for (var b = 0; b < 21 * 21; b++) {
      h = (h * 16777619) >>> 0;
      bits.push(h % 2 === 0);
    }
    return bits;
  }

  function generateReceiptQR(txId) {
    var svg = $("receiptQr");
    var url = "index.html?receipt=" + encodeURIComponent(txId);
    var bits = hashBits(url);
    var size = 21;
    var html = '<rect width="21" height="21" fill="#fff"/>';
    function finder(x, y) {
      html += '<rect x="' + x + '" y="' + y + '" width="7" height="7" fill="#222"/>';
      html += '<rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="5" height="5" fill="#fff"/>';
      html += '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" fill="#222"/>';
    }
    finder(0, 0);
    finder(14, 0);
    finder(0, 14);
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        var inFinder =
          (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
        if (inFinder) continue;
        if (bits[y * size + x]) html += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="#222"/>';
      }
    }
    svg.innerHTML = html;
    svg.setAttribute("data-url", url);
  }

  function renderReceipt(tx) {
    if (!tx) return;
    var d = new Date(tx.date);
    var dateStr = d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
    var rows = "";
    for (var i = 0; i < tx.items.length; i++) {
      var it = tx.items[i];
      rows += "<tr><td>" + it.name + " × " + it.quantity + "</td><td>" + formatRupiah(it.price * it.quantity) + "</td></tr>";
    }
    var method = tx.payment.method === "cash" ? "Tunai (simulasi)" : "QRIS (simulasi)";
    $("receiptBody").innerHTML =
      '<div class="receipt-meta"><span>No. transaksi</span><span>' + tx.id + "</span></div>" +
      '<div class="receipt-meta"><span>Tanggal</span><span>' + dateStr + "</span></div>" +
      '<div class="receipt-meta"><span>Pembeli</span><span>' + tx.customer.name + "</span></div>" +
      '<table class="receipt-table">' + rows + "</table>" +
      '<div class="receipt-meta"><span>Subtotal</span><span>' + formatRupiah(tx.subtotal) + "</span></div>" +
      '<div class="receipt-meta"><span>Diskon</span><span>-' + formatRupiah(tx.discount) + "</span></div>" +
      '<div class="receipt-meta"><span>Total</span><strong>' + formatRupiah(tx.total) + "</strong></div>" +
      '<div class="receipt-meta"><span>Metode</span><span>' + method + "</span></div>" +
      '<div class="receipt-meta"><span>Dibayar</span><span>' + formatRupiah(tx.payment.paidAmount) + "</span></div>" +
      '<div class="receipt-meta"><span>Kembalian</span><span>' + formatRupiah(tx.payment.change) + "</span></div>";
    generateReceiptQR(tx.id);
  }

  function printReceipt() {
    window.print();
  }

  function comboKey(items) {
    var ids = [];
    for (var i = 0; i < items.length; i++) ids.push(items[i].id);
    ids.sort();
    return ids.join("+");
  }

  function calculateBudgetRecommendation(budget) {
    var available = [];
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].available) available.push(PRODUCTS[i]);
    }
    available.sort(function (a, b) { return a.price - b.price; });
    if (!available.length) return [];
    if (budget < available[0].price) return [];

    var combos = [];
    var seen = {};

    function pushCombo(items) {
      var total = 0;
      for (var i = 0; i < items.length; i++) total += items[i].price;
      if (total > budget) return;
      var key = comboKey(items);
      if (seen[key]) return;
      seen[key] = 1;
      combos.push({ items: items.slice(), total: total });
    }

    for (var a = 0; a < available.length; a++) pushCombo([available[a]]);

    for (var x = 0; x < available.length; x++) {
      for (var y = x + 1; y < available.length; y++) {
        pushCombo([available[x], available[y]]);
      }
    }
    for (var p = 0; p < available.length; p++) {
      for (var q = p + 1; q < available.length; q++) {
        for (var r = q + 1; r < available.length; r++) {
          pushCombo([available[p], available[q], available[r]]);
        }
      }
    }

    combos.sort(function (a, b) {
      if (b.total !== a.total) return b.total - a.total;
      return a.items.length - b.items.length;
    });

    var unique = [];
    for (var u = 0; u < combos.length && unique.length < 3; u++) unique.push(combos[u]);
    return unique;
  }

  function renderBudgetIdle() {
    $("budgetResults").innerHTML = '<p class="muted">Pilih chip atau ketik nominal, lalu cari kombinasi.</p>';
  }

  function renderBudget() {
    var budget = Number($("budgetInput").value);
    var box = $("budgetResults");
    if (!budget || budget <= 0) {
      box.innerHTML = '<p class="error-text">Masukkan budget yang valid.</p>';
      return;
    }
    var recs = calculateBudgetRecommendation(budget);
    if (!recs.length) {
      box.innerHTML =
        '<div class="empty"><h3>Budget kamu belum cukup untuk menu yang tersedia.</h3>' +
        '<p class="muted">Naikkan budget, atau lihat menu dulu.</p>' +
        '<button class="btn btn-primary" type="button" data-nav="menu">Lihat Menu</button></div>';
      return;
    }
    var html = "<h2>Coba kombinasi ini.</h2><p class='muted'>Ini kombinasi yang paling pas buat budget kamu.</p>";
    for (var i = 0; i < recs.length; i++) {
      var rec = recs[i];
      var names = [];
      var ids = [];
      for (var j = 0; j < rec.items.length; j++) {
        names.push(rec.items[j].name + " (" + formatRupiah(rec.items[j].price) + ")");
        ids.push(rec.items[j].id);
      }
      html +=
        '<article class="combo-card">' +
          "<p>" + names.join(" + ") + "</p>" +
          "<p class='price'>" + formatRupiah(rec.total) + " / budget " + formatRupiah(budget) + "</p>" +
          '<button class="btn btn-primary btn-block" type="button" data-add-combo="' + ids.join(",") + '">Tambahkan ke Keranjang</button>' +
        "</article>";
    }
    box.innerHTML = html;
  }

  function renderQuiz() {
    var panel = $("quizPanel");
    if (state.quizFinished && state.quizScore === QUIZ_QUESTIONS.length) {
      panel.innerHTML =
        '<article class="info-card"><h2>Mantap! Kamu dapat voucher 10%.</h2>' +
        "<p>Kode: <strong>" + (state.voucher ? state.voucher.code : VOUCHER_TEMPLATE.code) + "</strong></p>" +
        '<p class="muted">Voucher bisa dipakai berkali-kali selama demo.</p>' +
        '<button class="btn btn-primary" type="button" data-nav="checkout">Pakai di checkout</button> ' +
        '<button class="btn btn-secondary" type="button" id="retryQuiz">Ulangi kuis</button></article>';
      return;
    }
    if (state.quizFinished && state.quizScore < QUIZ_QUESTIONS.length) {
      panel.innerHTML =
        '<article class="info-card"><h2>Belum tepat. Coba lagi.</h2>' +
        '<p class="muted">Skor ' + state.quizScore + " dari " + QUIZ_QUESTIONS.length + ".</p>" +
        '<button class="btn btn-secondary" type="button" id="retryQuiz">Coba lagi</button> ' +
        '<button class="btn btn-primary" type="button" data-nav="menu">Lihat Menu</button></article>';
      return;
    }
    if (!state.quizStarted) {
      var earnedCopy = state.voucher
        ? '<p class="muted">Voucher <strong>' + state.voucher.code + '</strong> masih aktif dan bisa dipakai lagi untuk demo.</p>'
        : '';
      panel.innerHTML =
        '<article class="info-card"><p>Tiga soal. Semua harus benar untuk membuka voucher KUIS10.</p>' +
        earnedCopy +
        '<button class="btn btn-primary" type="button" id="startQuiz">Mulai kuis</button></article>';
      return;
    }
    var q = QUIZ_QUESTIONS[state.quizIndex];
    var opts = "";
    for (var i = 0; i < q.options.length; i++) {
      var active = state.quizChoice === i ? " is-active" : "";
      opts += '<button class="quiz-option' + active + '" type="button" data-choice="' + i + '">' + q.options[i] + "</button>";
    }
    panel.innerHTML =
      '<article class="info-card"><p class="muted">Soal ' + (state.quizIndex + 1) + " / " + QUIZ_QUESTIONS.length + "</p>" +
      "<h2>" + q.question + "</h2>" + opts +
      '<button class="btn btn-primary btn-block" type="button" id="submitAnswer">Kirim jawaban</button></article>';
  }

  function burstConfetti() {
    var canvas = $("confetti");
    canvas.hidden = false;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    var bits = [];
    var colors = ["#E53935", "#FFC107", "#2E7D32", "#ffffff"];
    for (var i = 0; i < 80; i++) {
      bits.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 80,
        s: 4 + Math.random() * 6,
        c: colors[i % colors.length],
        v: 2 + Math.random() * 4
      });
    }
    var frames = 0;
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < bits.length; i++) {
        bits[i].y += bits[i].v;
        ctx.fillStyle = bits[i].c;
        ctx.fillRect(bits[i].x, bits[i].y, bits[i].s, bits[i].s * 0.6);
      }
      frames += 1;
      if (frames < 70) requestAnimationFrame(tick);
      else canvas.hidden = true;
    }
    tick();
  }

  function openDetail(id) {
    var p = getProduct(id);
    if (!p) return;
    state.selectedProduct = p;
    var cta = p.available
      ? '<button class="btn btn-primary btn-block" type="button" data-add="' + p.id + '">Tambah ke keranjang</button>'
      : '<button class="btn btn-block" disabled>Lagi habis</button>';
    $("detailContent").innerHTML =
      '<img class="detail-photo" src="' + p.image + '" alt="' + p.name + '">' +
      "<h2 id='detailName'>" + p.name + "</h2>" +
      "<p class='price'>" + formatRupiah(p.price) + "</p>" +
      "<p class='muted'>" + p.category + (p.available ? "" : " · Habis") + "</p>" +
      "<p style='margin:12px 0'>" + p.description + "</p>" + cta;
    var modal = $("productModal");
    modal.hidden = false;
    modal.classList.add("is-open");
  }

  function closeModals() {
    $("productModal").classList.remove("is-open");
    $("productModal").hidden = true;
    $("confirmModal").classList.remove("is-open");
    $("confirmModal").hidden = true;
  }

  function onClick(e) {
    var t = e.target.closest("[data-nav], [data-add], [data-detail], [data-filter], [data-category], [data-budget], [data-pay], [data-inc], [data-dec], [data-remove], [data-add-combo], [data-choice], [data-close-modal], [data-close-confirm], button, .tab, .chip");
    if (!t) return;

    if (t.hasAttribute("data-close-modal") || t.hasAttribute("data-close-confirm")) {
      closeModals();
      return;
    }
    if (t.id === "confirmClear") {
      state.cart = [];
      saveCart();
      updateCartBadge();
      closeModals();
      renderCart();
      showNotification("Keranjang dikosongkan.", "info");
      return;
    }
    if (t.id === "clearCartBtn") {
      if (!state.cart.length) return;
      $("confirmModal").hidden = false;
      $("confirmModal").classList.add("is-open");
      return;
    }
    if (t.id === "resetSearch") {
      state.search = "";
      $("searchInput").value = "";
      renderProducts();
      return;
    }
    if (t.id === "calcBudget") {
      renderBudget();
      return;
    }
    if (t.id === "applyVoucher") {
      applyDiscount();
      return;
    }
    if (t.id === "goPayment") {
      openPayment();
      return;
    }
    if (t.id === "payCash") {
      processCashPayment();
      return;
    }
    if (t.id === "simulateQris") {
      processQRISPayment();
      return;
    }
    if (t.id === "printReceipt") {
      printReceipt();
      return;
    }
    if (t.id === "startQuiz") {
      state.quizStarted = true;
      state.quizIndex = 0;
      state.quizScore = 0;
      state.quizChoice = null;
      state.quizFinished = false;
      renderQuiz();
      return;
    }
    if (t.id === "retryQuiz") {
      state.quizStarted = true;
      state.quizFinished = false;
      state.quizIndex = 0;
      state.quizScore = 0;
      state.quizChoice = null;
      renderQuiz();
      return;
    }
    if (t.id === "submitAnswer") {
      if (state.quizChoice === null) {
        showNotification("Pilih jawaban dulu.", "warning");
        return;
      }
      var q = QUIZ_QUESTIONS[state.quizIndex];
      if (state.quizChoice === q.answer) state.quizScore += 1;
      state.quizIndex += 1;
      state.quizChoice = null;
      if (state.quizIndex >= QUIZ_QUESTIONS.length) {
        state.quizFinished = true;
        if (state.quizScore === QUIZ_QUESTIONS.length) {
          state.voucher = {
            code: VOUCHER_TEMPLATE.code,
            type: VOUCHER_TEMPLATE.type,
            value: VOUCHER_TEMPLATE.value,
            used: false
          };
          saveReward();
          burstConfetti();
          showNotification("Mantap! Kamu dapat voucher 10%.", "success");
        }
      }
      renderQuiz();
      return;
    }

    if (t.hasAttribute("data-choice")) {
      state.quizChoice = Number(t.getAttribute("data-choice"));
      renderQuiz();
      return;
    }
    if (t.hasAttribute("data-add-combo")) {
      var ids = t.getAttribute("data-add-combo").split(",");
      for (var i = 0; i < ids.length; i++) addToCart(ids[i], 1);
      setView("cart");
      return;
    }
    if (t.hasAttribute("data-add")) {
      addToCart(t.getAttribute("data-add"), 1);
      return;
    }
    if (t.hasAttribute("data-detail")) {
      openDetail(t.getAttribute("data-detail"));
      return;
    }
    if (t.hasAttribute("data-inc")) {
      increaseQuantity(t.getAttribute("data-inc"));
      return;
    }
    if (t.hasAttribute("data-dec")) {
      decreaseQuantity(t.getAttribute("data-dec"));
      return;
    }
    if (t.hasAttribute("data-remove")) {
      removeFromCart(t.getAttribute("data-remove"));
      return;
    }
    if (t.hasAttribute("data-filter")) {
      state.category = t.getAttribute("data-filter");
      var tabs = document.querySelectorAll("[data-filter]");
      for (var f = 0; f < tabs.length; f++) tabs[f].classList.toggle("is-active", tabs[f] === t);
      renderProducts();
      return;
    }
    if (t.hasAttribute("data-category")) {
      state.category = t.getAttribute("data-category");
      var ft = document.querySelectorAll("[data-filter]");
      for (var k = 0; k < ft.length; k++) ft[k].classList.toggle("is-active", ft[k].getAttribute("data-filter") === state.category);
      setView("menu");
      return;
    }
    if (t.hasAttribute("data-budget")) {
      var val = t.getAttribute("data-budget");
      $("budgetInput").value = val;
      var chips = document.querySelectorAll("#budgetChips .chip");
      for (var ch = 0; ch < chips.length; ch++) chips[ch].classList.toggle("is-active", chips[ch] === t);
      return;
    }
    if (t.hasAttribute("data-pay")) {
      state.paymentMethod = t.getAttribute("data-pay");
      var pays = document.querySelectorAll(".pay-card");
      for (var p = 0; p < pays.length; p++) pays[p].classList.toggle("is-active", pays[p] === t);
      $("payError").hidden = true;
      return;
    }
    if (t.hasAttribute("data-nav")) {
      closeModals();
      setView(t.getAttribute("data-nav"));
    }
  }

  function onInput(e) {
    if (e.target.id === "searchInput") {
      state.search = e.target.value;
      renderProducts();
    }
    if (e.target.id === "cashInput") {
      var total = calculateTotal();
      var paid = Number(e.target.value);
      $("cashError").hidden = true;
      if (paid >= total) {
        $("cashHint").innerHTML = '<span class="change-ok">Kembalian ' + formatRupiah(paid - total) + "</span>";
      } else if (e.target.value) {
        $("cashHint").textContent = "Kembalian dihitung setelah nominal cukup.";
      }
    }
  }

  document.addEventListener("click", onClick);
  document.addEventListener("input", onInput);
  $("sortSelect").addEventListener("change", function () {
    state.sort = $("sortSelect").value;
    renderProducts();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModals();
  });
  $("productModal").addEventListener("click", function (e) {
    if (e.target === $("productModal")) closeModals();
  });
  $("confirmModal").addEventListener("click", function (e) {
    if (e.target === $("confirmModal")) closeModals();
  });

  loadCart();
  loadReward();
  updateCartBadge();
  renderHome();
  renderAbout();
  renderProducts();

  var params = new URLSearchParams(window.location.search);
  var receiptId = params.get("receipt");
  if (receiptId) {
    var tx = findTransaction(receiptId);
    if (tx) {
      renderReceipt(tx);
      setView("receipt");
    } else {
      showNotification("Struk tidak ditemukan di browser ini.", "warning");
    }
  }
})();
