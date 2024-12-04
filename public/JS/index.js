// Get the toggle button and sidebar
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

window.addEventListener('load', () => {
    sidebar.classList.add('hidden'); 
});

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('hidden'); 
});

document.querySelectorAll('.content-box').forEach(contentBox => {
    contentBox.addEventListener('click', () => {
        const link = contentBox.querySelector('a');
        if (link) {
            window.location.href = link.href; 
        }
    });
});
