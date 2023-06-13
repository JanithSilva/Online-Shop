const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

function toggleMobileMenu() {
    mobileMenu.classList.toggle('open');
}

mobileMenuBtnElement.addEventListener('click', toggleMobileMenu);
