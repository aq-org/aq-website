function changeLanguage(select) {
    const selectedLanguage = select.value;
    const currentUrl = window.location.href;
    let path = currentUrl.split('/').slice(3).join('/');
  
    if (!['ar', 'en', 'zh', 'fr', 'ru', 'es'].includes(path.substr(0, 2))) {
      path = `/${selectedLanguage}/${path}`;
    } else {
      path = `/${selectedLanguage}${path.substr(2)}`;
    }
  
    window.location.href = path;
  }