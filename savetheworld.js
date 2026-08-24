function selectProduct(name){
  alert("محصول انتخاب شد: " + name + "\n\nبرای اتصال به سیستم سفارش، لینک/فرم خرید پروژه را در همین تابع قرار دهید.");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addProductForm");
  const grid = document.getElementById("productGrid");
  const message = document.getElementById("productMessage");
  const imageInput = document.getElementById("productImage");

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[ch]));
  }

  function renderProduct(product) {
    const article = document.createElement("article");
    article.className = "stw-product";
    const image = product.image
      ? `<img class="stw-product-image" src="${product.image}" alt="${escapeHtml(product.name)}">`
      : `<div class="stw-product-art art-one">STW</div>`;

    article.innerHTML = `
      ${image}
      <div class="stw-product-body">
        <div class="stw-status">موجود</div>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description || "محصول جدید MasterShop")}</p>
        <div class="stw-product-bottom">
          <strong>${escapeHtml(product.price)}</strong>
          <button type="button" onclick="selectProduct('${String(product.name).replace(/'/g, "\\'")}')">انتخاب</button>
        </div>
      </div>`;
    grid.appendChild(article);
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const file = imageInput.files[0];
    const product = {
      name: document.getElementById("productName").value.trim(),
      description: document.getElementById("productDescription").value.trim(),
      price: document.getElementById("productPrice").value.trim(),
      image: ""
    };

    if (!product.name || !product.price) return;

    const saveAndRender = () => {
      const products = JSON.parse(localStorage.getItem("stwProducts") || "[]");
      products.push(product);
      try {
        localStorage.setItem("stwProducts", JSON.stringify(products));
      } catch (e) {
        console.warn("محصول در حافظه مرورگر ذخیره نشد:", e);
      }
      renderProduct(product);
      form.reset();
      message.textContent = "محصول با موفقیت اضافه شد.";
      setTimeout(() => message.textContent = "", 2500);
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = e => { product.image = e.target.result; saveAndRender(); };
      reader.readAsDataURL(file);
    } else {
      saveAndRender();
    }
  });

  const savedProducts = JSON.parse(localStorage.getItem("stwProducts") || "[]");
  savedProducts.forEach(renderProduct);
});
