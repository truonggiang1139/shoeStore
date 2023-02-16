let listData = [
  {
    key: 1,
    value: {
      id: 1,
      name: "Nike Air Max 90 SE",
      img: "./asset/029d86dd-1549-4221-a18b-25d165998d1f.webp",
      price: 229,
      quantity: 20,
    },
  },
  {
    key: 2,
    value: {
      id: 2,
      name: "Nike Air Force 1 '07",
      img: "./asset/572475a8-427c-43a6-9fa9-5d41827fc848.webp",
      price: 205,
      quantity: 10,
    },
  },
  {
    key: 3,
    value: {
      id: 3,
      name: "Nike Air Max Dawn SE",
      img: "./asset/487b0832-8c6e-4cdb-a4d8-fbe24f114eae.webp",
      price: 220,
      quantity: 10,
    },
  },
  {
    key: 4,
    value: {
      id: 4,
      name: "Nike SB Dunk Low Pro Premium",
      img: "./asset/sb-dunk-low-pro-skate-shoes-NWJncN.jfif",
      price: 190,
      quantity: 10,
    },
  },
];
let listProduct = [];
let keyLocalStorageListSP = "DANHSACHSP";
let keyLocalStorageItemCart = "DANHSACHITEMCART";

function setData() {
  localStorage.setItem(keyLocalStorageListSP, JSON.stringify(listData));
  localStorage.setItem(keyLocalStorageItemCart, JSON.stringify(listProduct));
}
setData();
renderProduct();
function getData() {
  return JSON.parse(localStorage.getItem(keyLocalStorageListSP));
}

function renderProduct() {
  const shoes = getData();

  let shoesDat = shoes.map((shoe) => {
    return `<div class="product">
      <div class="product_header">
        <img
          src=${shoe.value.img}
          alt=""
          class="product_image"
        />
        <a class="product_cart" href="" onclick="handleClick(event,${shoe.value.id})"
          ><i class="fa-solid fa-cart-plus"></i
        ></a>
      </div>
      <div class="product_desc">
        <div class="product_desc_title">${shoe.value.name}</div>
        <div class="product_detail">
          <div class="product_price"> $${shoe.value.price}</div>
          <div class="product_quantity">Quantity:${shoe.value.quantity}</div>
        </div>
      </div>
    </div>`;
  });

  document.querySelector(".container").innerHTML = shoesDat.join("");
}

function handleClick(event, id) {
  event.preventDefault();
  addProduct(id);
}

function addProduct(id) {
  let num = undefined;
  let item = getData();
  if (item[id - 1].value.quantity === 0) {
    alert("sold out");
    return;
  }
  let itemCart = JSON.parse(localStorage.getItem(keyLocalStorageItemCart));
  for (let i = 0; i < itemCart.length; i++) {
    if (itemCart[i].id === id) {
      num = i;
    }
  }
  if (num !== undefined) {
    itemCart[num].quantity += 1;
  } else {
    itemCart.push({ id, quantity: 1 });
  }
  item[id - 1].value.quantity -= 1;

  localStorage.setItem(keyLocalStorageItemCart, JSON.stringify(itemCart));
  localStorage.setItem(keyLocalStorageListSP, JSON.stringify(item));
  renderProduct();
}
