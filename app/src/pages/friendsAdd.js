import { translate } from '../translations';
import { navigate } from '../routes/routes.js';
import { changeLanguage } from './dashboard.js';


const eventListenersFriendsAdd = []; // Listener'ları saklamak için bir dizi oluşturun

export default function FriendsAdd() {
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
                <!-- Friend List -->
                    <div id="userContainer" class="text-center mt-5">
                      <ul id="usersList" class="list-group"></ul>
                </div>
                </div>
                `;
    return pageElement;
}
export function destroyFriendsAddEvents() {
    // Öncelikle eventListeners dizisinin tanımlı olup olmadığını kontrol edin
    if (!eventListenersFriendsAdd || !Array.isArray(eventListenersFriendsAdd)) {
        console.warn('eventListeners tanımlı değil veya bir dizi değil!');
        return;
    }
    eventListenersFriendsAdd.forEach(item => {
        // Her bir item için link ve listener özelliklerinin varlığını kontrol edin
        if (item.link && typeof item.link.removeEventListener === 'function' && item.listener) {
            item.link.removeEventListener('click', item.listener);
        }
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
    const addFriendButtons = document.querySelectorAll('.add-friend-button');
    addFriendButtons.forEach(button => {
        button.textContent = e.detail.lang.addFriend;
    });
});

function  initFriendsEvents(){
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
        eventListenersFriendsAdd.push({ link, listener });
    });
    console.log('2');
    
    function removeColor(link) { // Şu anda kullanılmıyor 
        link.style.color = ''; // Renk ayarını kaldır
    }
    console.log('3');
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
                // navigate(true, '/friendsadd','page-main', searchFilter);
                break;
            default:
                console.log('friendsEventAdddddlistener-> Unknown path:', path);
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




async function sendFriendRequest(username, listContainer) {
    try {
        const response = await fetch('http://localhost:8000/api/friends/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                type: 'send',
                username
            }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        console.log('Friend request sent:', responseData);
        listContainer.remove();
    } catch (error) {
        console.error('Error sending friend request:', error);
    }
}

export async function initFriendsAddEvent(searchTerm) {
    initFriendsEvents();
    const selectedLanguage = JSON.parse(localStorage.getItem('theLanguage'));
    const endpoint = 'http://localhost:8000/api/users';
    const url = searchTerm ? `${endpoint}?searchTerm=${encodeURIComponent(searchTerm)}` : endpoint;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const usersData = await response.json();
        console.log('Users :', usersData);

        const userListElements = document.getElementById('usersList');
        if (userListElements) {
            if (usersData.length > 0) {
                userListElements.style.display = 'block'; // Listeyi göster
                userListElements.innerHTML = ''; // Önceki içeriği temizle

                usersData.forEach(element => {
                    const listItem = document.createElement('li');
                    listItem.textContent = element.username;            
                    // Arkadaş ekleme butonu
                    const addButton = document.createElement('button');
                    addButton.textContent = selectedLanguage.addFriend; // Metni ve "+" işaretini ekle
                    addButton.classList.add('btn', 'btn-light', 'add-friend-button');
                    

                    const listContainer = document.createElement('div');
                    listContainer.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                    listContainer.appendChild(listItem);
                    listContainer.appendChild(addButton);

                    userListElements.appendChild(listContainer);
                    
                    const addButtonClickListener = () => {
                        sendFriendRequest(element.username, listContainer);
                    };
                    addButton.addEventListener('click', addButtonClickListener);
                    eventListenersFriendsAdd.push({ addButton, addButtonClickListener });
                });
            } else {
                userListElements.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error fetching users list:', error);      
    }
} 
