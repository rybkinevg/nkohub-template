const body = document.querySelector('.body');
const navMenu = document.querySelector('.nav-menu');
const burgerPanel = document.querySelector('.nav-trigger');
const burgerBtn = document.querySelector('.burger');
const sidenavContent = document.querySelector('.nav-menu__content');

burgerPanel.addEventListener('click', showSidenavContent);

function showSidenavContent() {

    if (navMenu.classList.contains('open-menu')) {

        body.classList.remove('fix');
        navMenu.classList.remove('open-menu');
        burgerBtn.classList.remove('burger--active');
    } else {

        body.classList.add('fix');
        navMenu.classList.add('open-menu');
        burgerBtn.classList.add('burger--active');
    }
}