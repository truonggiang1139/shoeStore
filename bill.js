const headerBills = `
<tr>
<th>Code</th>
<th>Customer Name</th>
<th>Date</th>
<th>Item Numbers</th>
<th>Total Quantity</th>
<th>Total Price</th>
<th>Return</th>
</tr>
`;
const headerBillDetail = `
<tr>
<th>Product Image</th>
<th>Product Name</th>
<th>Price</th>
<th>Quantity</th>
<th>Total Price</th>
</tr>`;
const keyLocalStorageListSP = "DANHSACHSP";
const getData = () => {
  return JSON.parse(localStorage.getItem(keyLocalStorageListSP));
};
const getBillsData = async () => {
  const res = await fetch("http://localhost:3000/orders");
  const data = await res.json();
  return data;
};
const getBillData = async (id) => {
  const res = await fetch(`http://localhost:3000/orders/${id}`);
  const data = await res.json();
  return data;
};
const deleteBillData = async (id) => {
  const res = await fetch(`http://localhost:3000/orders/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
const renderBillData = async () => {
  let bills = await getBillsData();
  if (bills.length === 0) {
    document.querySelector(
      ".container"
    ).innerHTML = `<h3 class="empty_bills">Chưa có đơn hàng nào được đặt.</h3>`;
    return;
  }
  let billsData = bills.map(
    (item) =>
      `<tr>
    <td>
      <a href="" onclick="showBillDetail(event,this.textContent)"
        >${item.id}</a
      >
    </td>
    <td>${item.CustomerName}</td>
    <td>${item.date}</td>
    <td>${item.items.length}</td>
    <td>${item.total_quantity}</td>
    <td>$${item.total_price}</td>
    <td>
      <i
        class="fa-solid fa-rectangle-xmark return_item"
        onclick="handleReturnItem(${item.id})"
      ></i>
    </td>
  </tr>`
  );
  document.querySelector(".itemBill").innerHTML = headerBills.concat(
    billsData.join("")
  );
};

const showBillDetail = async (event, code) => {
  event.preventDefault();
  const bill = await getBillData(code);
  const shoeInshop = getData();
  const itemBill = bill.items;
  let totalBill = 0;
  const billData = itemBill.map((item) => {
    totalBill += shoeInshop[item.id - 1].value.price * item.quantity;
    return `<tr>
      <td class="product_img">
        <img
          src=${shoeInshop[item.id - 1].value.img}
          alt=""
        />
      </td>
      <td>${shoeInshop[item.id - 1].value.name}</td>
      <td>$ ${shoeInshop[item.id - 1].value.price}</td>
      <td>${item.quantity}</td>
      <td>$ ${shoeInshop[item.id - 1].value.price * item.quantity} </td>
    </tr>
      `;
  });

  document.querySelector(".order_detail_body").innerHTML =
    headerBillDetail.concat(billData.join(""));
  document.querySelector(
    ".total_bill"
  ).textContent = `Total Price:$ ${totalBill.toLocaleString("en-US")}`;
  document.querySelector(".modal").style.display = "flex";
};

const handleReturnItem = async (id) => {
  const data = await getBillData(id);
  let shoeInshop = getData();
  const itemRemove = data.items;
  itemRemove.forEach((item) => {
    shoeInshop[item.id - 1].value.quantity += item.quantity;
  });
  localStorage.setItem(keyLocalStorageListSP, JSON.stringify(shoeInshop));
  deleteBillData(id);
};
const closeOrderDetail = () => {
  document.querySelector(".modal").style.display = "none";
};
renderBillData();
