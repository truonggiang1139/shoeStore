let keyLocalStorageListSP = "DANHSACHSP";
let keyLocalStorageItemCart = "DANHSACHITEMCART";
let header = `
<tr>
<th class="left_text">Product Name</th>
<th></th>
<th>Quantity</th>
<th>SubTotal</th>
<th>Total</th>
<th>Clear Cart</th>
</tr>`;
function getData() {
  return JSON.parse(localStorage.getItem(keyLocalStorageListSP));
}
function getDataCart() {
  return JSON.parse(localStorage.getItem(keyLocalStorageItemCart));
}
function setData(param1, param2) {
  localStorage.setItem(keyLocalStorageListSP, JSON.stringify(param1));
  localStorage.setItem(keyLocalStorageItemCart, JSON.stringify(param2));
}

function renderProductInCart() {
  const shoeIncart = getDataCart();
  const shoeInshop = getData();
  if (shoeIncart.length === 0) {
    document.querySelector(
      ".container"
    ).innerHTML = `<h3 class="empty_cart">Chưa có sản phẩm trong giỏ hàng của bạn.</h3>`;
    return;
  }
  let shoeData = shoeIncart.map(
    (item) =>
      `<tr>
            <td>
              <img
                class="left_text"
                src=${shoeInshop[item.id - 1].value.img}
                alt=""
              />
            </td>
            <td class="cc">${shoeInshop[item.id - 1].value.name}</td>
            <td>
              <span onclick="subQuantity(${item.id})">-</span>
              <span>${item.quantity}</span>
              <span onclick="addQuantity(${item.id})">+</span>
            </td>
            <td>$ ${shoeInshop[item.id - 1].value.price}</td>
            <td>$ ${(
              shoeInshop[item.id - 1].value.price * item.quantity
            ).toLocaleString("en-US")}</td>
            <td ><i class="fa-solid fa-trash clear" onclick="clearProduct(${
              item.id
            })"></i></td>
          </tr>`
  );
  document.querySelector(".itemCart").innerHTML = header.concat(
    shoeData.join("")
  );
}

function addQuantity(id) {
  let itemCart = getDataCart();
  let itemShop = getData();
  if (itemShop[id - 1].value.quantity === 0) {
    alert("Sold out");
    return;
  }
  itemCart.map((item) =>
    item.id === id
      ? (item.quantity += 1) && (itemShop[item.id - 1].value.quantity -= 1)
      : item
  );
  setData(itemShop, itemCart);
  renderProductInCart();
}

function subQuantity(id) {
  let itemCart = getDataCart();
  let itemShop = getData();
  console.log(itemShop);
  itemCart.map((item) =>
    item.id === id
      ? (itemShop[item.id - 1].value.quantity += 1) && (item.quantity -= 1)
      : item
  );
  itemCart = itemCart.filter((item) => item.quantity > 0);

  setData(itemShop, itemCart);
  renderProductInCart();
}

function clearProduct(id) {
  let itemCart = getDataCart();
  let itemShop = getData();
  itemCart = itemCart.filter((item) =>
    item.id === id
      ? (itemShop[id - 1].value.quantity += item.quantity) &&
        (item.quantity = 0)
      : item
  );
  setData(itemShop, itemCart);
  renderProductInCart();
}
renderProductInCart();
