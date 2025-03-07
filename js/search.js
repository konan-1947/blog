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
waitForElement("#search-bar", (element) => {
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        document.querySelectorAll('.post-preview').forEach(post => {
            const title = post.querySelector('a').textContent.toLowerCase();
            post.style.display = title.includes(keyword) ? 'block' : 'none';
        });
    });
})
