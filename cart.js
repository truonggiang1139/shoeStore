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
    document.querySelector(".payment").innerHTML = ``;
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
            <td ><i class="fa-solid fa-trash clear" onclick="clearProduct(${item.id
      })"></i></td>
          </tr>`
  );

  document.querySelector(".itemCart").innerHTML = header.concat(
    shoeData.join("")
  );
  renderPayment();
}
function renderPayment() {
  const shoeIncart = getDataCart();
  const shoeInshop = getData();
  let total = 0;
  for (let i = 0; i < shoeIncart.length; i++) {
    total +=
      shoeIncart[i].quantity * shoeInshop[shoeIncart[i].id - 1].value.price;
  }
  const element = `<div class="Total">Total: $${total.toLocaleString(
    "en-US"
  )}</div>
  <div class="btn_buy" ><button onclick="handleOpen(event)">Buy</button></div>`;
  document.querySelector(".payment").innerHTML = element;
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

async function getDataProvinces() {
  let responsive = await fetch("https://provinces.open-api.vn/api/");
  let data = await responsive.json();
  renderProvinces(data);
}
function renderProvinces(data) {
  let dataProvinces = data.map(
    (item) => `<option value=${item.code}> ${item.name}</option>`
  );
  document.querySelector("#provinces").innerHTML += dataProvinces.join("");
}
function renderDistricts(data) {
  let dataDistricts = data.map(
    (item) => `<option value=${item.code}> ${item.name}</option>`
  );
  document.querySelector("#districts").innerHTML += dataDistricts.join("");
}

function renderWards(data) {
  let dataWards = data.map(
    (item) => `<option value=${item.code}> ${item.name}</option>`
  );
  document.querySelector("#wards").innerHTML += dataWards.join("");
}

async function handleChangeProvinces(e) {
  let responsive = await fetch(
    `https://provinces.open-api.vn/api/p/${e}?depth=2`
  );
  let data = await responsive.json();
  document.querySelector("#districts").innerHTML =
    "<option selected disabled hidden>Chọn Huyện/Quận</option>";
  document.querySelector("#wards").innerHTML =
    "<option selected disabled hidden>Chọn Phường/Xã</option>";
  renderDistricts(data.districts);
}

async function handleChangeDistricts(e) {
  let responsive = await fetch(
    `https://provinces.open-api.vn/api/d/${e}?depth=2`
  );
  let data = await responsive.json();
  document.querySelector("#wards").innerHTML =
    "<option selected disabled hidden>Chọn Phường/Xã</option>";
  renderWards(data.wards);
}

function handleClose(e) {
  e.preventDefault();
  document.querySelector(".modal").style.display = "none";
}
function handleOpen(e) {
  e.preventDefault();
  document.querySelector(".modal").style.display = "flex";
}

function handleSubmit(e) {
  e.preventDefault();

  validate()






}

function validate() {
  let person = getInfoData();
  if (person.firstName === "") {
    setErrorMessage('first_name', 'Vui lòng nhập họ');
  }
  if (person.lastName === "") {
    setErrorMessage('last_name', 'Vui lòng nhập tên');
  }
  if (person.email === "") {
    setErrorMessage('email', 'Địa chỉ Email không được để trống');
  }
  else if (!checkEMail(person.email)) {
    setErrorMessage('email', 'Vui lòng nhập lại địa chỉ Email');
  }
  if (person.phone === "") {
    setErrorMessage('phone', 'Số điện thoại không được để trống');
  }
  else if (isNaN(person.phone)) {
    setErrorMessage('phone', 'Vui lòng nhập lại số điện thoại');
  }
  if (person.province === "Chọn Tỉnh/Thành phố") {
    setErrorMessage('provinces', 'Vui lòng chọn tỉnh thành');
  }
  if (person.district === 'Chọn Huyện/Quận') {
    setErrorMessage('districts', 'Vui lòng chọn huyện quận');
  }
  if (person.ward === 'Chọn Phường/Xã') {
    setErrorMessage('wards', 'Vui lòng chọn phường xã');
  }
}

function setErrorMessage(param, msg) {
  document.querySelector(`#${param}_msg`).innerText = msg;
  document.querySelector(`#${param}`).style.border = '2px solid #ff6d6d';
}
function checkEMail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email)
}
function handleChangeInput(id) {
  document.querySelector(`#${id}`).style.border = '1px solid #dbdbdb';

  document.querySelector(`#${id}_msg`).innerText = '';
}
function getOptionSelected(param) {
  let selectedOption = param.options[param.selectedIndex];
  let selectedText = selectedOption.textContent;
  return selectedText;
}
function getInfoData() {
  let firstName = document.querySelector("#first_name").value;
  let lastName = document.querySelector("#last_name").value;
  let name = `${firstName} ${lastName}`;
  let email = document.querySelector("#email").value;
  let phone = document.querySelector("#phone").value;
  let province = getOptionSelected(document.querySelector("#provinces"));
  let district = getOptionSelected(document.querySelector("#districts"));
  let ward = getOptionSelected(document.querySelector("#wards"));
  let houseNum = document.querySelector("#house_num").value;

  return (person = {
    firstName,
    lastName,
    email,
    phone,
    province,
    district,
    ward,
    houseNum,
  });
}
renderProductInCart();
getDataProvinces();
