
var userLang = navigator.language || navigator.userLanguage;

var currentPage = window.location.pathname;

if (userLang.startsWith('ar')) {
    window.location.href = '/ar/404';
} else if (userLang.startsWith('zh')) {
    window.location.href = '/zh/404';
} else if(userLang.startsWith('en')){
    window.location.href = '/en/404';
} else if(userLang.startsWith('fr')){
    window.location.href = '/fr/404';
} else if(userLang.startsWith('ru')){
    window.location.href = '/ru/404';
} else if(userLang.startsWith('es')){
    window.location.href = '/es/404';
}