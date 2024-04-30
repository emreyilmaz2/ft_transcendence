import '../styles/dashboard.css';
import { navigate } from '../routes/routes.js';
import trLanguage from '../translations/tr.js';
import enLanguage from '../translations/en.js';
import deLanguage from '../translations/de.js';
import { checkLoginStatus } from '../static/app.js';


const eventListenersDashboard = []; // Listener'ları saklamak için bir dizi oluşturun
export function changeLanguage(language) {
    localStorage.setItem('theLanguage', JSON.stringify(language));
    document.dispatchEvent(new CustomEvent('languageChange', { detail: { lang: language } }));
}

export default function Dashboard() {
    const pageElement = document.createElement('div');
    pageElement.id = 'wrapper';
    pageElement.className = 'd-flex flex-row vh-100 w-100 overflow-x-auto overflow-y-hidden bg-custom-primary';
    pageElement.innerHTML = `
        <div id="wrapper-content" class="d-flex vh-100 w-100">
            <!-- sidebar -->
            <div class="d-flex flex-column flex-shrink-0 p-3 text-white vh-100 bg-custom-primary border-custom-r" style="width: 280px;">
                <a href="/game"
                   class="nav-link d-flex align-items-center mb-1 me-md-auto text-white text-decoration-none">
                    <span id="emreText" class="fs-4 p-3 mb-2">Ping Pong Game</span>
                </a>
                <ul class="nav nav-pills flex-column mb-auto">
                    <li class="nav-item">
                        <a href="/profile" class="nav-link text-custom-light navbar-text">
                            <i class="fa-solid fa-user text-secondary navbar-icon"></i>
                            <span id="profile_text_span">Profile</span>
                        </a>
                    </li>
                    <li>
                        <a href="/game" class="nav-link text-custom-light navbar-text">
                            <i class="fa-solid fa-gamepad text-secondary navbar-icon"></i>
                            <span id="game_text_span">Game</span>
                        </a>
                    </li>
                    <li>
                        <a href="/friends" class="nav-link text-custom-light navbar-text">
                            <i class="fa-solid fa-user-group text-secondary navbar-icon"></i>
                            <span id="friends_text_span">Friends</span>
                        </a>
                    </li>
                </ul>
                <hr>
            </div>
            
            <!-- content -->
            <div class="content vh-100 w-100 overflow-auto">
                <div class="vh-100">
                    <div id="page-header" class="d-flex justify-content-end mb-3 mb-md-0 me-md-auto p-3 bg-custom-primary border-custom-lb">
                        <div class="d-flex align-items-center justify-content-center mx-3">
                        <div class="dropdown">
                            <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                               id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                   <i class="fa-solid fa-globe"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="languageDropdown">
                                <li id="languageTR" class="dropdown-item">
                                    Türkçe
                                    <img src="https://flagsapi.com/TR/flat/24.png" style="margin-right: 8px;">
                                </li>
                                <li id="languageEN" class="dropdown-item">
                                    English
                                    <img src="https://flagsapi.com/US/flat/24.png" style="margin-right: 8px;">
                                </li>
                                <li id="languageDE" class="dropdown-item">
                                    Deutsch
                                    <img src="https://flagsapi.com/DE/flat/24.png" style="margin-right: 8px;">
                                </li>
                            </ul>
                        </div>
                    </div>
                        <div class="dropdown">
                        <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle mx-2"
                           id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                            <img id="ProfileImage" src="" alt="" width="40" height="40" class="rounded-circle me-2"
                                 style="margin-right: 10px;">
                                 <strong id="dashboardName"></strong>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                            <li>
                                <a id="logoutButton" class="logoutClass" href="/login">Logout</a>
                            </li>
                        </ul>
                    </div>                
                    </div>
                    <div id="page-title" class="px-2"></div>
                    <div id="page-main" class="mx-2"></div>
                </div>
            </div>
        </div>
    `;
    
    return pageElement;
}
document.addEventListener('languageChange', (e) => {
    const t0 = document.getElementById('emreText');
    if(t0 && e?.detail?.lang?.header) t0.innerText = e.detail.lang.header;
    const t1 = document.getElementById('profile_text_span');
    if(t1 && e?.detail?.lang?.profile) t1.innerText = e.detail.lang.profile;
    const t2 = document.getElementById('game_text_span');
    if(t2 && e?.detail?.lang?.game) t2.innerText = e.detail.lang.game;
    const t3 = document.getElementById('friends_text_span');
    if(t3 && e?.detail?.lang?.friends) t3.innerText = e.detail.lang.friends;
    const t4 = document.getElementById('logoutButton');
    if(t4 && e?.detail?.lang?.logout) t4.innerText = e.detail.lang.logout;
});
document.addEventListener('profileUpdated', (e) => {
    document.getElementById('ProfileImage').src = e.detail.imageUrl;
});
async function getLanguage() {
    try {
        const response = await fetch('http://localhost:8000/api/get-language/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        if(data.language == 'Deutsch'){
            localStorage.setItem('theLanguage', JSON.stringify(deLanguage));
            changeLanguage(deLanguage);
        }
        else if(data.language == 'Türkçe'){
            localStorage.setItem('theLanguage', JSON.stringify(trLanguage));
            changeLanguage(trLanguage);
        }
        else if(data.language == 'English'){
            localStorage.setItem('theLanguage', JSON.stringify(enLanguage));
            changeLanguage(enLanguage);
        }
        else{
            localStorage.setItem('theLanguage', JSON.stringify(trLanguage));
            changeLanguage(trLanguage);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
export async function destroyDashboardEvents() {
    eventListenersDashboard.forEach(item => {
        item.link.removeEventListener('click', item.listener);
    });
}

async function updateLanguagePreference(language) {
    try {
        const response = await fetch('http://localhost:8000/api/get-language/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ language })
        });
        if (!response.ok) {
            console.log('abi olmadi ya');
            throw new Error('Network response was not ok');
        }
        else{
            console.log('guncelledim gibi');
        }
    } catch (error) {
        console.log('hata var gibi');
        console.error('Error:', error);
    }
}

export async function initDashboardEvents() {
    getLanguage();
    const lastPath = localStorage.getItem('updatePath');
    console.log('dashboard fonksiyonuna hosgeldiniz');
    try {
        const response = await fetch('http://localhost:8000/api/profile/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        // Get the profile full name
        localStorage.setItem('PlayerName', data.username);//oyunda kullanıcı isimlerini çekebilmek için
        const profileName = `${data.first_name} ${data.last_name}`;
        document.getElementById('dashboardName').textContent = profileName;
        
        
        // Get the profile images
        let imageUrl;
        if(data.normal_avatar){
            //imageUrl = `http://localhost:8000${data.normal_avatar}`;
            imageUrl = data.normal_avatar;
        }else if(data.intra_avatar){
            imageUrl = data.intra_avatar;
        }
        document.getElementById('ProfileImage').src = imageUrl ;
    } catch (error) {
        console.error('Error:', error);
    }
    
    const dashboardLinks = document.querySelectorAll('.nav-link');
    dashboardLinks.forEach((link) => {
        const listener = function(event){
            const path = link.getAttribute('href');
            event.preventDefault();
            console.log(`${path} was clicked!`);
            localStorage.setItem('updatePath', path);
            handleNavigation(path);
        };
        link.addEventListener('click', listener);
        eventListenersDashboard.push({ link, listener });
    });
    // Logout butonu için ekstra event listener ekleniyor
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault(); // Sayfa yenilenmesini önle
            handleNavigation('/login'); // Logout işlevini çağır
        });
    }
    // Türkçe seçeneğine tıklama işlevselliğini ekleyin
    document.getElementById('languageTR').addEventListener('click', function(event) {
        event.preventDefault();
        updateLanguagePreference('Türkçe');
        changeLanguage(trLanguage);
    });
    document.getElementById('languageEN').addEventListener('click', function(event) {
        event.preventDefault();
        updateLanguagePreference('English');
        changeLanguage(enLanguage);
    });
    document.getElementById('languageDE').addEventListener('click', function(event) {
        event.preventDefault();
        updateLanguagePreference('Deutsch');
        changeLanguage(deLanguage);
    });
    function handleNavigation(path) {
        console.log('gelen path : ', path);
        switch (path) {
            case '/profile':
                if(window.location.pathname != '/profile')
                    navigate(true, '/profile','page-main');
                break;
            case '/game':
                if(window.location.pathname != '/game')
                    navigate(true,'/game','page-main');
                break;
            case '/friends':
                if(window.location.pathname != '/friends')
                    navigate(true,'/friends','page-main');
                break;
            case '/login':
                logout();
                break;
            default:
                console.log('Unknown path:', path);
                break;
        }
    }
    
    async function logout() {
        try {
            const response = await fetch('http://localhost:8000/api/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            if (response.ok) {
                console.log('Logout successful');
                // Token'i ve diğer oturum bilgilerini temizle
                localStorage.removeItem('accessToken');
                localStorage.removeItem('Profile');
                localStorage.removeItem('PlayerName');
                localStorage.removeItem('theLanguage');
                localStorage.removeItem('updatePath');
                localStorage.removeItem('user');
                const isLogin = checkLoginStatus();
                navigate(isLogin, '/login', 'app');
            } else {
                console.error('Logout failed');
                const errorData = await response.json(); // Hata mesajını al
                console.log(errorData);
                alert(errorData.error); // Hata mesajını kullanıcıya göster
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}