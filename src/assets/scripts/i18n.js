
var userLang = navigator.language || navigator.userLanguage;

var currentPage = window.location.pathname;

if (userLang.startsWith('ar')) {
    window.location.href = '/ar' + currentPage;
} else if (userLang.startsWith('zh')) {
    window.location.href = '/zh' + currentPage;
} else if(userLang.startsWith('en')){
    window.location.href = '/en' + currentPage;
} else if(userLang.startsWith('fr')){
    window.location.href = '/fr' + currentPage;
} else if(userLang.startsWith('ru')){
    window.location.href = '/ru' + currentPage;
} else if(userLang.startsWith('es')){
    window.location.href = '/es' + currentPage;
}