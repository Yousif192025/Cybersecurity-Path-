// إدارة القوائم المنسدلة
document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('mouseenter', () => {
        dropdown.querySelector('.dropdown-menu').style.display = 'block';
    });
    
    dropdown.addEventListener('mouseleave', () => {
        dropdown.querySelector('.dropdown-menu').style.display = 'none';
    });
});

// إضافة فعالية للهاتف
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.main-nav').classList.toggle('active');
});
