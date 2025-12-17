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

    renderProducts(products); // LOAD AFTER DATA COMES
  })
  .catch(error => {
    console.error("Google Sheet Error:", error);
    container.innerHTML =
      "<p style='color:red;'>Failed to load product data</p>";
  });


