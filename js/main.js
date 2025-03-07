// Load thông tin cá nhân từ info.json
function waitForElement(selector, callback) {
    const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            obs.disconnect(); // Dừng quan sát sau khi tìm thấy phần tử
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Gọi hàm để đợi phần tử có id "abc" xuất hiện
waitForElement("#personal-info", (element) => {
    fetch('data/info.json')
    .then(response => response.json())
    .then(data => {
        document.getElementById('personal-info').innerHTML = `
            <p>${data.name}</p>
            <p>${data.bio}</p>
        `;
        document.getElementById('contact-info').innerHTML = `
            <p>Email: ${data.contact.email}</p>
            <p>GitHub: <a href="${data.contact.github}">${data.contact.github}</a></p>
            <p>SĐT: ${data.contact.phone}</p>
        `;
    });
});
    
    


// Cuộn mượt khi nhấn nút
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(btn.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});