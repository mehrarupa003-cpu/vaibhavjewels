/* ===========================
   GOOGLE SHEET CONNECTION
=========================== */

let products = [];

const container = document.getElementById("product-container");

/* RENDER PRODUCTS */

function renderProducts(filteredProducts) {
  container.innerHTML = "";

  if (!filteredProducts || filteredProducts.length === 0) {
    container.innerHTML = "<p>No product found</p>";
    return;
  }

  let tableHTML = `
    <table border="1" cellpadding="10">
      <tr>
        <th>Product ID</th>
        <th>Name</th>
        <th>Price</th>
        <th>Metal</th>
        <th>QR Code</th>
      </tr>
  `;

  filteredProducts.forEach(p => {

    const productURL = `https://mehrarupa003-cpu.github.io/vaibhavjewels/?product=${p.id}`;

    const qrImg = `
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(productURL)}">
    `;

    tableHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td>${p.metal}</td>
        <td>${qrImg}</td>
      </tr>
    `;
  });

  tableHTML += "</table>";
  container.innerHTML = tableHTML;
}

function getProductFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("product");
}
function hideSearchBar() {
  document.querySelector(".search-box").style.display = "none";
}

function renderSingleProduct(product) {
  if (!product) {
    container.innerHTML = "<p>Product not found</p>";
    return;
  }

  const productURL = `https://mehrarupa003-cpu.github.io/vaibhavjewels/?product=${product.id}`;

  const qrImg = `
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(productURL)}">
  `;

  container.innerHTML = `
    <div style="max-width:500px;margin:30px auto;padding:20px;border:1px solid #ccc">
      <h2>${product.name}</h2>
      <p><strong>Product ID:</strong> ${product.id}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Metal:</strong> ${product.metal}</p>
      <div>${qrImg}</div>
    </div>
  `;
}


/* SEARCH FUNCTION */
function searchProduct() {
  if (products.length === 0) return;

  const searchValue = document
    .getElementById("searchInput")
    .value
    .trim()
    .toUpperCase();

  if (searchValue === "") {
    renderProducts(products);
    return;
  }

  const filtered = products.filter(p =>
    p.id.toUpperCase().includes(searchValue)
  );

  renderProducts(filtered);
}

/* FETCH DATA FROM GOOGLE SHEET */
const sheetURL =
  "https://opensheet.elk.sh/184Fc43SHO4CAOa_jhhp3lPvPMNSLEXlyPIOtrpJ52rc/Sheet1";

fetch(sheetURL)
  .then(response => response.json())
.then(data => {
  products = data.map(item => ({
    id: item.id?.trim(),
    name: item.name,
    price: item.price,
    metal: item.metal
  }));

  const productFromURL = getProductFromURL();

if (productFromURL) {
  hideSearchBar(); // 👈 hide search when QR scanned

  const filtered = products.filter(p =>
    p.id.toUpperCase() === productFromURL.toUpperCase()
  );

  renderSingleProduct(filtered[0]);
} else {
  renderProducts(products);
}

})

  .catch(error => {
    console.error("Google Sheet Error:", error);
    container.innerHTML =
      "<p style='color:red;'>Failed to load product data</p>";
  });




