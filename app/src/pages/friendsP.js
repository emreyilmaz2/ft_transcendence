import { translate } from '../translations';
import { navigate } from '../routes/routes.js';
import { changeLanguage } from './dashboard.js';


const eventListenersFriendsP = []; // Listener'ları saklamak için bir dizi oluşturun

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
                <ul id="pendingList" class="list-group">
                 </ul>
                </div>
                `;
    return pageElement;
}
export function destroyFriendsPEvents() {
    // Öncelikle eventListeners dizisinin tanımlı olup olmadığını kontrol edin
    if (!eventListenersFriendsP || !Array.isArray(eventListenersFriendsP)) {
        console.warn('eventListeners tanımlı değil veya bir dizi değil!');
        return;
    }
    eventListenersFriendsP.forEach(item => {
        // Her bir item için link ve listener özelliklerinin varlığını kontrol edin
        if (item.link && typeof item.link.removeEventListener === 'function' && item.listener) {
            item.link.removeEventListener('click', item.listener);
        } else {
            console.warn('Geçersiz item veya item.link.removeEventListener bir fonksiyon değil!', item);
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

    const pendingListElement = document.getElementById('pendingList');
    if (pendingListElement) {
        const statusSpans = pendingListElement.querySelectorAll('.text-muted');
        if (statusSpans.length > 0) {
            statusSpans.forEach(span => {
                const userDataObj = span.getAttribute('data-user');
                const userData = JSON.parse(userDataObj);
                if (userData.user_role === 'sender') {
                    span.textContent = e.detail.lang.waitingfriendreq;
                } else {
                    span.textContent = `${userData.sender} ${e.detail.lang.requestMessage}`;
                }
            });
        }
    }
    const acceptButtons = document.querySelectorAll('.btn-success');
    acceptButtons.forEach(button => {
        button.textContent = e.detail.lang.acceptfriendreq; // Yeni dildeki metni atama
    });
    const rejectButtons = document.querySelectorAll('.btn-danger');
    rejectButtons.forEach(button => {
        button.textContent = e.detail.lang.rejectfriendreq; // Yeni dildeki metni atama
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
        eventListenersFriendsP.push({ link, listener });
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
                // navigate(true, '/friendsp','page-main', searchFilter);
                break;
            case '/friendsadd':
                navigate(true, '/friendsadd','page-main', searchFilter);
                break;
            default:
                console.log('friendsEventPPPPlistener-> Unknown path:', path);
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

export async function initFriendsPEvents(searchFilter){
    initFriendsEvents();
    const selectedLanguage = JSON.parse(localStorage.getItem('theLanguage'));
    const endpoint = 'http://localhost:8000/api/pending-requests';
    const url = searchFilter ? `${endpoint}?searchTerm=${encodeURIComponent(searchFilter)}` : endpoint;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response_sent was not ok');
        }
        const requestData = await response.json();
        console.log('Pending Request List:', requestData);
        
        const pendingListElement = document.getElementById('pendingList');
        if (pendingListElement && Array.isArray(requestData.friend_requests)) {
            pendingListElement.innerHTML = ''; // Önceki içeriği temizle
            
            const friendRequests = requestData.friend_requests;
            friendRequests.forEach(request => {
                // Liste öğesi oluştur
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            
                // Kullanıcı adı için span elementi oluştur
                const usernameSpan = document.createElement('span');
                usernameSpan.classList.add('font-weight-bold'); // Kullanıcı adını vurgula
                if (request.user_role === 'sender') {
                    usernameSpan.textContent = request.receiver;
                } else if (request.user_role === 'receiver') {
                    usernameSpan.textContent = request.sender;
                }
                
                // Durum için span elementi oluştur
                const statusSpan = document.createElement('span');
                statusSpan.classList.add('ml-auto', 'text-muted');
                statusSpan.setAttribute('data-user', JSON.stringify(request)); // Kullanıcı adını bir attribute olarak sakla
                if (request.user_role === 'sender') {
                    statusSpan.textContent = selectedLanguage.waitingfriendreq;
                } else {
                    statusSpan.textContent = `${request.sender} ${selectedLanguage.requestMessage}`; // İsteği gönderenin adını kullan
                }
            
                // Buton container'ı oluştur
                const buttonContainer = document.createElement('div');
                buttonContainer.classList.add('button-container');
            
                // Receiver ise butonları oluştur ve buttonContainer'a ekle
                if (request.user_role === 'receiver') {
                    const acceptButton = document.createElement('button');
                    acceptButton.type = 'button';
                    acceptButton.classList.add('btn', 'btn-success', 'mr-2');
                    acceptButton.textContent = selectedLanguage.acceptfriendreq;
                    
                    const rejectButton = document.createElement('button');
                    rejectButton.type = 'button';
                    rejectButton.classList.add('btn', 'btn-danger');
                    rejectButton.textContent = selectedLanguage.rejectfriendreq;

                    // Butonlara olay dinleyicileri ekle
                    const acceptButtonListener = () => {
                        acceptFriendRequest(request.sender, listItem); // İstek id'siyle kabul etme işlemi
                    };
                    const rejectButtonListener = () => {
                        rejectFriendRequest(request.sender, listItem);
                    };
                    acceptButton.addEventListener('click', acceptButtonListener);
                    eventListenersFriendsP.push({ acceptButton, acceptButtonListener });
                    rejectButton.addEventListener('click', rejectButtonListener);
                    eventListenersFriendsP.push({ rejectButton,  rejectButtonListener });

                    buttonContainer.appendChild(acceptButton);
                    buttonContainer.appendChild(rejectButton);
                }
            
                // Liste öğesine diğer elementleri ekle
                listItem.appendChild(usernameSpan);
                listItem.appendChild(statusSpan);
                listItem.appendChild(buttonContainer);
            
                // Liste container'ına öğeyi ekle
                pendingListElement.appendChild(listItem);
            });            
        }
    } catch (error) {
        console.error('Error fetching pending request list:', error);
    }
}


// Kabuletme işlevi
function acceptFriendRequest(username, listItem) {
    const acceptData = {
        type: 'reply',
        username,
        status: 'accept'
    };

    // Burada isteği göndermek için uygun bir yol kullanmalısınız, fetch API gibi
    fetch('http://127.0.0.1:8000/api/friends/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(acceptData),
    }).then(response => {
        if (response.ok) {
            console.log(username);
            // Başarılı bir şekilde kabul edildiğinde yapılacak işlemler
            console.log('Arkadaşlık isteği kabul edildi.');
            // İsteği kabul eden öğeyi DOM'dan kaldırabilirsiniz, örneğin:
            listItem.remove();
        } else {
            throw new Error('Arkadaşlık isteği kabul edilemedi.');
        }
    }).catch(error => {
        console.error('Hata:', error);
    });
}

// Reddetme işlevi
function rejectFriendRequest(username, listItem) {
    const rejectData = {
        type: 'reply',
        username,
        status: 'reject'
    };
    
    fetch('http://127.0.0.1:8000/api/friends/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(rejectData),
    }).then(response => {
        if (response.ok) {
            // Başarılı bir şekilde reddedildiğinde yapılacak işlemler
            console.log('Arkadaşlık isteği reddedildi.');
            // İsteği reddeden öğeyi DOM'dan kaldırabilirsiniz, örneğin:
            listItem.remove();
        } else {
            throw new Error('Arkadaşlık isteği reddedilemedi.');
        }
    }).catch(error => {
        console.error('Hata:', error);
    });
}
