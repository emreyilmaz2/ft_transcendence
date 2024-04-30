import { PrivateRouteList, PublicRouteList } from './routeList';
import ErrorPage from '../pages/errorPage';

let currentActivePage = null;
let canGoBack = false;


export function navigate(isLogin, path, elementByID, searchFilter = '', pushState = true) {
    console.log('navigate e geldim gidiom -> ', path);
    console.log('islogin: ', isLogin);
    console.log('elementById: ', elementByID);
    
    if (pushState) {
        window.history.pushState({}, '', path);
    }
    Routes(isLogin, path, elementByID, searchFilter);
}

export const Routes = (isLogin, targetPath, elementByID = 'app', searchFilter) => {
    const path = targetPath || window.location.pathname;
    const accessibleRoutes = isLogin ? { ...PublicRouteList, ...PrivateRouteList } : PublicRouteList;
    const routeInfo = accessibleRoutes[path] || { component: ErrorPage }; // Eğer rota bulunamazsa hata sayfasını döndür
    
    // Önceki sayfanın temizlik işlemlerini gerçekleştir
    console.log('route a geldim');
    console.log('1 -> aktif sayfa -> ', currentActivePage);
    console.log('2 -> elementById -> ', elementByID);
    if (currentActivePage && currentActivePage.destroy && currentActivePage.id !== 'dashboard') {
        currentActivePage.destroy();
    }
    const appElement = document.getElementById(elementByID);
    if (appElement) {
        appElement.innerHTML = ''; // İçeriği temizle
        const componentInstance = routeInfo.component();
        appElement.appendChild(componentInstance);
    } else {
        // Hata işleme veya kullanıcıyı bir hata sayfasına yönlendirme
        console.error(`Element with ID '${elementByID}' not found.`);
    }
    // Başlangıç fonksiyonunu çağır
    if (routeInfo.init) {
        routeInfo.init(searchFilter);
    }
    // Aktif sayfa bilgisini güncelle
    currentActivePage = routeInfo;
};

// Kullanıcı giriş durumunu kontrol etmek
function checkLoginStatus() {
    return !!localStorage.getItem('accessToken');
}

window.addEventListener('popstate', (event) => {
    const isLogin = checkLoginStatus();
    const currentPath = window.location.pathname;
    navigate(isLogin, currentPath, 'page-main', '', false);
    console.log('popstate event triggered');
});