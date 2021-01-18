const body = document.querySelector('.body');
const navMenu = document.querySelector('.nav-menu');
const burgerBtn = document.querySelector('.nav-trigger');
const sidenavContent = document.querySelector('.nav-menu__content');

burgerBtn.addEventListener('click', showSidenavContent);

function showSidenavContent() {

    if (navMenu.classList.contains('open-menu')) {

        body.classList.remove('fix');
        navMenu.classList.remove('open-menu');
    } else {

        body.classList.add('fix');
        navMenu.classList.add('open-menu');
    }
}