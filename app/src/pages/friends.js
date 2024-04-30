
import { navigate } from '../routes/routes.js';
import { changeLanguage } from './dashboard.js';


const eventListeners = []; // Listener'ları saklamak için bir dizi oluşturun

export default function Friends() {
    const pageElement = document.createElement('div');

    pageElement.innerHTML = `
    <h3 id="friendsHeader" class="p-4 text-custom-light">Friends</h3>
    <div class="content-area p-4">
      <nav class="navbar navbar-expand-lg bg-transparent">
         <div class="container-fluid">
            <button class="navbar-toggler" type="button" 
                    data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" 
                    aria-controls="navbarSupportedContent" aria-expanded="false" 
                    aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a id="all" href="/friendsall" class="nav-link text-custom-light ">All</a>
                    </li>
                    <li class="nav-item">
                        <a id="pending" href="/friendsp" class="nav-link text-custom-light">Pending</a>
                    </li>
                    <li class="nav-item">
                        <a id="add" href="/friendsadd" class="nav-link text-custom-light">Add Friend</a>
                    </li>
                </ul>
                <form id="searchForm" class="d-flex">
                    <input id="searchInput" class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                    <button id="searchButton" class="btn btn-outline-light" type="submit">Search</button>
                </form>
                </div>
                </div>
                </nav>
                
                <div id="page-title" class="px-2"></div>
                <div id="page-title" class="px-2"></div>
                <!-- Friend List -->
                    <div id="userContainer" class="text-center mt-5">
                      <ul id="usersList" class="list-group"></ul>
                </div>
                </div>
                `;
    return pageElement;
}

export function destroyFriendsEvents() {
    eventListeners.forEach(item => {
        item.link.removeEventListener('click', item.listener);
    });
}
document.addEventListener('languageChange', (e) => {
    const t1 = document.getElementById('friendsHeader');
    if(t1) t1.textContent = e.detail.lang.friends;
    const t2 = document.getElementById('all');
    if(t2) t2.textContent = e.detail.lang.friendsAll;
    const t3 = document.getElementById('pending');
    if(t3) t3.textContent = e.detail.lang.friendsPending;
    const t4 = document.getElementById('add');
    if(t4) t4.textContent = e.detail.lang.friendsAdd;
    const t5 = document.getElementById('searchInput');
    if(t5) t5.placeholder = e.detail.lang.search;
    const t6 = document.getElementById('searchButton');
    if(t6) t6.innerText = e.detail.lang.search;
});

export function  initFriendsEvents(){
    const selectedLanguage = JSON.parse(localStorage.getItem('theLanguage'));
    changeLanguage(selectedLanguage);

    const searchForm = document.querySelector('#searchForm');
    searchForm.addEventListener('submit', handleSearch);

    const friendElementLinks = document.querySelectorAll('.nav-link');
    console.log('1');
    friendElementLinks.forEach((link) => {
        const listener = function(event){
            const path = link.getAttribute('href');
            event.preventDefault();
            console.log(`${path} was clicked!`);
            localStorage.setItem('updatePath', path);
            handleNavigation(path);
            // Tüm nav-linklerin rengini temizle
            friendElementLinks.forEach(link => {
                link.style.color = '';
            });
            // Tıklanan linkin rengini mavi yap
            link.style.color = 'blue';
        };
        link.addEventListener('click', listener);
        eventListeners.push({ link, listener });
    });
    function handleNavigation(path, searchFilter='') {
        console.log('Navigating to:', path);
        localStorage.setItem('updatepath', path);
        switch (path) {
            case '/friendsall':
                navigate(true, '/friendsall','page-main', searchFilter);
                break;
            case '/friendsp':
                navigate(true, '/friendsp','page-main', searchFilter);
                break;
            case '/friendsadd':
                navigate(true, '/friendsadd','page-main', searchFilter);
                break;
            default:
                console.log('friendsEventlistener-> Unknown path:', path);
                break;
        }
    }
}


function handleSearch(event) {
    console.log('4');
    event.preventDefault(); // Formun otomatik submit olmasını engelle

    const searchInput = document.querySelector('#searchInput'); // Arama inputunu seç
    const searchTerm = searchInput.value.trim(); // Arama metnini al ve boşlukları kaldır
    
    if (searchTerm) {
        console.log('Aranan terim:', searchTerm);
        const currentPath = window.location.pathname;
        console.log('Şu anda bulunduğun sayfa:', currentPath);
        // Arama sonuçlarını ilgili sayfada göstermek için `navigate` fonksiyonunu çağır
        // navigate(true, `${currentPath}?search=${encodeURIComponent(searchTerm)}`, 'page-main2');
        switch (currentPath) {
            case '/friendsall':
                navigate(true, '/friendsall','page-main', searchTerm);
                break;
            case '/friendsp':
                navigate(true, '/friendsp','page-main', searchTerm);
                break;
            case '/friendsadd':
                navigate(true, '/friendsadd','page-main', searchTerm);
                break;
            default:
                console.log('Unknown path:', currentPath);
                break;
        }
    } else {
        const currentPath = window.location.pathname;
        console.log('5');
        console.log('Arama metni boş. Child componente yonlendiriliyor..');
        switch (currentPath) {
            case '/friendsall':
                navigate(true, '/friendsall','page-main');
                break;
            case '/friendsp':
                navigate(true, '/friendsp','page-main');
                break;
            case '/friendsadd':
                navigate(true, '/friendsadd','page-main');
                break;
            default:
                console.log('Unknown path:', currentPath);
                break;
        }
    }
}
