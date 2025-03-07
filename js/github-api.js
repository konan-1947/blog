const blogUrl = 'https://api.github.com/repos/konan-1947/blog/contents/blog';
const digressUrl = 'https://api.github.com/repos/konan-1947/blog/contents/digress';
const itemsPerPage = 3;


// Lưu trữ dữ liệu toàn cục để tránh truyền qua onclick
let blogData = [];
let digressData = [];

function estimateReadingTime(fileSize) {
    const wordsPerByte = 0.2; // Ước lượng trung bình
    const words = fileSize * wordsPerByte;
    return Math.ceil(words / 18000); 
}

function renderPosts(containerId, data, page) {
    const container = document.getElementById(containerId);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = data.slice(start, end);

    container.innerHTML = paginatedData.map(item => `
        <div class="post-preview">
            <img src="/assets/img/icon.png" alt="Post Thumbnail" class="post-thumbnail">
            <div class="post-content">
                <a href="post.html?post=${item.name}&type=${containerId === 'blog-posts' ? 'blog' : 'digress'}">${item.name.replace('.docx', '')}</a>
                <p>Thời gian đọc khoảng: ${estimateReadingTime(item.size)} phút</p>
            </div>
        </div>
    `).join('');

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const pagination = document.getElementById(containerId === 'blog-posts' ? 'blog-pagination' : 'digress-pagination');
    pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => `
        <button onclick="renderPosts('${containerId}', ${containerId === 'blog-posts' ? 'blogData' : 'digressData'}, ${i + 1})">${i + 1}</button>
    `).join('');
}


// Lấy dữ liệu từ GitHub
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

waitForElement("#blog-pagination", (element) => {
    fetch(blogUrl).then(res => res.json()).then(data => renderPosts('blog-posts', data, 1));
    fetch(digressUrl).then(res => res.json()).then(data => renderPosts('digress-posts', data, 1));
     // Hiển thị loading cho phần posts
     document.getElementById('blog-posts').innerHTML = `
     <div class="loading-posts" style="text-align: center;">
         <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="Loading..." style="width: 50px;">
     </div>
 `;
 document.getElementById('digress-posts').innerHTML = `
     <div class="loading-posts" style="text-align: center;">
         <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="Loading..." style="width: 50px;">
     </div>
 `;

 // Lấy dữ liệu từ GitHub và lưu vào biến toàn cục
 Promise.all([
     fetch(blogUrl).then(res => res.json()),
     fetch(digressUrl).then(res => res.json())
 ])
     .then(([blogResponse, digressResponse]) => {
         blogData = blogResponse; // Lưu dữ liệu blog
         digressData = digressResponse; // Lưu dữ liệu digress
         renderPosts('blog-posts', blogData, 1);
         renderPosts('digress-posts', digressData, 1);
     })
     .catch(error => console.error('Lỗi khi fetch dữ liệu GitHub:', error))
     .finally(() => {
         // Ẩn loading sau khi fetch xong
         document.querySelectorAll('.loading-posts').forEach(el => el.remove());
     });
})
