import './app.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '../translations/tr.js';
import '../translations/en.js';

import { Routes } from '../routes/routes.js';
import { navigate } from '../routes/routes.js';
import { setLanguage } from '../translations/index.js';

const App = () => {
    const isLogin = checkLoginStatus(); // Kullanıcının giriş durumunu kontrol et

    let initialPath;
    if (window.location.pathname === '/') {
        if (isLogin) {
            initialPath = '/dashboard';  // Kullanıcı giriş yapmışsa dashboard'a yönlendir
        } else {
            initialPath = '/login';      // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
        }
    } else {
        initialPath = '/dashboard';
        window.location.href = '/';
    } 
    console.log('after path : ', initialPath);

    Routes(isLogin, initialPath);
    // navigate(isLogin, initialPath, 'app'); // 'app' elementID olarak kullanılıyor

};

// Giriş yapmış kullanıcıyı kontrol etmek için kodlar (örneğin localStorage üzerinden)
export function checkLoginStatus() {
    return !!localStorage.getItem('accessToken');
}

window.addEventListener('DOMContentLoaded', App);