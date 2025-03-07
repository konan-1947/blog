// Chờ DOM tải xong
document.addEventListener('DOMContentLoaded', () => {
    // Load navbar và footer
    fetch('components/navbar.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
            // Loại bỏ thanh tìm kiếm trong trang post.html
            const searchBar = document.getElementById('search-bar');
            if (searchBar) searchBar.remove();
            document.querySelectorAll(".nav-links a")[0].href = "/blog/index.html#hero";
            document.querySelectorAll(".nav-links a")[1].href = "/blog/index.html#posts-section";
            document.querySelectorAll(".nav-links a")[2].href = "/blog/index.html#footer";

        })
        .catch(error => console.error('Lỗi khi fetch navbar:', error));

    fetch('components/footer.html')
        .then(res => res.text())
        .then(data => document.getElementById('footer').innerHTML = data)
        .catch(error => console.error('Lỗi khi fetch footer:', error));

    // Lấy bài viết từ URL và hiển thị trong iframe
    const urlParams = new URLSearchParams(window.location.search);
    const post = urlParams.get('post');
    const type = urlParams.get('type'); // Lấy tham số type (blog hoặc digress)
    const iframe = document.getElementById('post-iframe');
    
    // Điều chỉnh URL iframe dựa trên type
    const baseUrl = 'https://view.officeapps.live.com/op/embed.aspx?src=https://raw.githubusercontent.com/konan-1947/blog/main/';
    iframe.src = `${baseUrl}${type === 'digress' ? 'digress' : 'blog'}/${post}`;

    // Fetch bài viết liên quan từ cả hai thư mục blog và digress
    const blogUrl = 'https://api.github.com/repos/konan-1947/blog/contents/blog';
    const digressUrl = 'https://api.github.com/repos/konan-1947/blog/contents/digress';

    Promise.all([
        fetch(blogUrl).then(res => res.json()),
        fetch(digressUrl).then(res => res.json())
    ])
        .then(([blogData, digressData]) => {
            const relatedPostsList = document.getElementById('related-posts-list');
            // Kết hợp dữ liệu từ blog và digress
            const allPosts = [...blogData.map(item => ({ ...item, type: 'blog' })), 
                            ...digressData.map(item => ({ ...item, type: 'digress' }))];
            // Lọc các bài viết khác bài hiện tại và lấy tối đa 3 bài
            const relatedPosts = allPosts
                .filter(item => item.name !== post) // Loại bỏ bài hiện tại
                .slice(0, 5); // Lấy 5 bài đầu tiên
            relatedPostsList.innerHTML = relatedPosts.map(item => `
                <div class="related-post-item">
                    <a href="post.html?post=${item.name}&type=${item.type}">${item.name.replace('.docx', '')}</a>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Lỗi khi fetch bài viết liên quan:', error);
            document.getElementById('related-posts-list').innerHTML = '<p>Không thể tải bài viết liên quan.</p>';
        });
});