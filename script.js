function showOrderForm() {
    const checkboxes = document.querySelectorAll(".product-checkbox:checked");
    if (checkboxes.length === 0) {
        alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng.");
        return;
    }

    let selectedProducts = [];
    let totalPrice = 0;

    checkboxes.forEach(checkbox => {
        const productName = checkbox.value;
        const productPrice = parseInt(checkbox.dataset.price);
        if (productName && productPrice) {
            selectedProducts.push(productName);
            totalPrice += productPrice;
        }
    });

    if (selectedProducts.length === 0) {
        alert("Có lỗi xảy ra khi chọn sản phẩm. Vui lòng thử lại.");
        return;
    }

    document.getElementById("selected-products").value = selectedProducts.join(", ");
    document.getElementById("total-price").value = totalPrice.toLocaleString() + " VNĐ";
    document.getElementById("order-form").style.display = "block";
}

document.getElementById("orderForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const selectedProducts = document.getElementById("selected-products").value;
    const totalPrice = document.getElementById("total-price").value;

    const data = {
        name: name,
        phone: phone,
        email: email,
        product: selectedProducts,
        totalPrice: totalPrice.replace(" VNĐ", ""),
        date: new Date().toLocaleString()
    };

    console.log("Dữ liệu gửi đi:", data); // In dữ liệu để kiểm tra

    fetch("https://script.google.com/macros/s/AKfycbyVe8ojx-77s6ou1kknyCKH9M6bwVd8E7sP2qokKHYdnVbqrTa5mZqo0Dac3vnuBrMaqQ/exec?token=trung1234", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        mode: "cors", // Đảm bảo CORS được xử lý
        redirect: "follow" // Theo dõi chuyển hướng nếu có
    })
    .then(response => {
        console.log("Phản hồi từ server:", response); // In phản hồi để kiểm tra
        if (!response.ok) {
            throw new Error("Lỗi HTTP: " + response.status);
        }
        return response.json();
    })
    .then(result => {
        console.log("Kết quả từ Google Apps Script:", result); // In kết quả để kiểm tra
        if (result.result === "success") {
            alert("Đơn hàng đã được gửi thành công!");
            document.getElementById("orderForm").reset();
            document.getElementById("order-form").style.display = "none";
            document.querySelectorAll(".product-checkbox").forEach(checkbox => checkbox.checked = false);
        } else {
            alert("Có lỗi xảy ra: " + result.message);
        }
    })
    .catch(error => {
        console.error("Lỗi khi gửi đơn hàng:", error); // In lỗi chi tiết
        alert("Có lỗi xảy ra, vui lòng thử lại: " + error.message);
    });
});