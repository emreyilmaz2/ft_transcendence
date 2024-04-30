import { translate } from '../translations';
import { navigate } from '../routes/routes.js';
import { changeLanguage } from './dashboard.js';


const eventListenersFriendsAll = []; // Listener'ları saklamak için bir dizi oluşturun

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
                <ul id="friendsList" class="list-group">
                </ul>
                </div>
                `;
    return pageElement;
}
export function destroyFriendsAllEvents() {
    // Öncelikle eventListeners dizisinin tanımlı olup olmadığını kontrol edin
    if (!eventListenersFriendsAll || !Array.isArray(eventListenersFriendsAll)) {
        console.warn('eventListeners tanımlı değil veya bir dizi değil!');
        return;
    }
    eventListenersFriendsAll.forEach(item => {
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
        eventListenersFriendsAll.push({ link, listener });
    });
    function handleNavigation(path, searchFilter='') {
        console.log('Navigating to:', path);
        localStorage.setItem('updatepath', path);
        switch (path) {
            case '/friendsall':
                // navigate(true, '/friendsall','page-main', searchFilter);
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

export async function initFriendsAllEvents(searchFilter) {
    initFriendsEvents();
    const selectedLanguage = JSON.parse(localStorage.getItem('theLanguage'));

    const endpoint = 'http://localhost:8000/api/friends';
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
            throw new Error('Network response was not ok');
        }
        const friendsData = await response.json();
        console.log('Friends List:', friendsData);
        const friendsListElement = document.getElementById('friendsList');
        
        if (friendsListElement && friendsData.length > 0) {
            friendsListElement.innerHTML = ''; // Önceki içeriği temizle
            friendsData.forEach(friend => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                // Kullanıcı bilgileri ve online göstergesi için bir konteyner oluştur
                
                const infoContainer = document.createElement('div');
                infoContainer.classList.add('d-flex', 'flex-grow-1', 'align-items-center'); // flex-grow-1 tüm genişliği kaplamasını sağla
                const onlineIndicator = document.createElement('div');
                onlineIndicator.classList.add('online-indicator', friend.has_logged_in ? 'online' : 'offline');

                const usernameSpan = document.createElement('span');
                usernameSpan.textContent = `${friend.username}`;
                usernameSpan.classList.add('mx-2'); // Sağa ve sola margin ekleyi
                
                infoContainer.appendChild(onlineIndicator);
                infoContainer.appendChild(usernameSpan);
                
                // Butonlar için ayrı bir konteyner
                const buttonsContainer = document.createElement('div');
                buttonsContainer.classList.add('buttons-container');

                const profilegetButton = document.createElement('button');
                profilegetButton.textContent = selectedLanguage.profile;
                profilegetButton.classList.add('btn', 'btn-sm', 'btn-warning', 'mr-2');

                const profilegetButtonListener = () => {
                    modalcreate(friend.username);
                };
                profilegetButton.addEventListener('click', profilegetButtonListener);
                eventListenersFriendsAll.push({ profilegetButton, profilegetButtonListener });
                
                // Remove button and its event listener
                const removeButton = document.createElement('button');
                removeButton.textContent = 'X';
                removeButton.classList.add('btn', 'btn-danger', 'btn-sm');
                removeButton.title = selectedLanguage.unfriend;
                const removeButtonListener = () => {
                    unfriendSomeone(friend.username, listItem);
                };
                removeButton.addEventListener('click', removeButtonListener);
                eventListenersFriendsAll.push({ removeButton, removeButtonListener });
                
                buttonsContainer.appendChild(profilegetButton);

                buttonsContainer.appendChild(removeButton);                
                listItem.appendChild(infoContainer);
                listItem.appendChild(buttonsContainer);
                
                friendsListElement.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error('Error fetching friends list:', error);
    }
}

async function unfriendSomeone(username, listItem) {
    try {
        const response = await fetch('http://localhost:8000/api/friends/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                type: 'unfriend',
                username
            }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        console.log('Seçtiğiniz kişi arkadaşlarınızdan çıkarıldı!:', responseData);
        listItem.remove();
        // İstek başarıyla gönderildiğinde yapılacak işlemleri buraya ekleyebilirsiniz
    } catch (error) {
        console.error('Error unfriending someone:', error);
    }
}

function modalcreate(username) {
    const modalBackdrop = document.createElement('div');
    modalBackdrop.classList.add('modal-backdrop', 'fade', 'show');
    document.body.appendChild(modalBackdrop);

    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal', 'fade', 'show', 'd-block');
    modalDialog.style.transform = 'translateY(200px)';
    modalDialog.style.transition = 'transform 0.3s ease';
    modalDialog.setAttribute('id', 'exampleModal');
    modalDialog.setAttribute('tabindex', '-1');
    modalDialog.setAttribute('role', 'dialog');
    modalDialog.setAttribute('aria-labelledby', 'exampleModalCenter');
    modalDialog.setAttribute('aria-hidden', 'true');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.style.maxWidth = '60%'; // Modal içeriğinin maksimum genişliğini belirleyin
    modalContent.style.margin = '0 auto'; // Modalı ortalamak için margin ekleyin

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    const modalTitle = document.createElement('h5');
    modalTitle.classList.add('modal-title');
    modalTitle.setAttribute('id', 'exampleModalCenter');
    modalTitle.textContent = 'User Profile';
    modalTitle.style.width = '100%'; // Başlığın genişliğini ayarlayın
    modalTitle.style.textAlign = 'center'; // Başlığı ortalamak için stil ekleyin

    modalHeader.appendChild(modalTitle);

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.style.fontSize = '18px';
    modalBody.style.textAlign = 'center';
    modalBody.style.fontWeight = 'bold';

    // Modal içeriği buraya eklenecek
    async function updateModalContentWithUser(username) {
        const endpoint = 'http://localhost:8000/api/users';
        const url = `${endpoint}/${encodeURIComponent(username)}`;
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
            const person = await response.json();
            console.log('The person: ', person);
            // modalBody'nin içeriğini güncelleyin. Örneğin:
            const modalBody = document.querySelector('.modal-body');
            let imageUrl;
            if (person.normal_avatar)
                //imageUrl = `http://localhost:8000${person.normal_avatar}`;
                imageUrl = person.normal_avatar;
            else if (person.intra_avatar)
                imageUrl = person.intra_avatar;
            const selectedLanguage = JSON.parse(localStorage.getItem('theLanguage'));
            let htmlContent = `
                <div class="text-center mb-3">
                    <img src="${imageUrl}" alt="Profil Fotoğrafı" class="img-fluid rounded-circle" style="width: 150px; height: 150px;">
                </div>
                <p>${selectedLanguage.username}: ${person.username}</p> 
                <p>${selectedLanguage.firstName}: ${person.first_name}</p> 
                <p>${selectedLanguage.lastName}: ${person.last_name}</p> 
                <p>${selectedLanguage.email}: ${person.email}</p> 
                <p>${selectedLanguage.matches}:</p>
                <ul>`;
            // Maçları döngüye al ve HTML'e ekle
            person.matches.forEach(match => {
                var resultText;
                if (match.result === 'win') {
                    resultText = `${selectedLanguage.resultWin}`;
                    htmlContent += `
                        <li>🏆
                            <strong>${selectedLanguage.matchDate}:</strong> ${match.match_date} -
                            <strong>${match.player1} VS ${match.player2} -
                            <strong>${selectedLanguage.result}:</strong> ${resultText} -
                            <strong>${selectedLanguage.score}:</strong> ${match.score}
                        </li>`;
                } else if (match.result === 'loss') {
                    resultText = selectedLanguage.resultLoss;
                    htmlContent += `
                        <li>🤕
                            <strong>${selectedLanguage.matchDate}:</strong> ${match.match_date} -
                            <strong>$${match.player1} VS ${match.player2} -
                            <strong>${selectedLanguage.result}:</strong> ${resultText} -
                            <strong>${selectedLanguage.score}:</strong> ${match.score}
                        </li>`;
                }
            });
            // HTML dizisine kapanış etiketlerini ekle
            htmlContent += '</ul>';
            modalBody.innerHTML = htmlContent;
        }
        catch (error) {
            console.error('An error occurred:', error);
            // Hata durumunda modalBody içeriğini güncelleyin
            const modalBody = document.querySelector('.modal-body');
            modalBody.innerHTML = '<p>Kullanıcı bilgileri alınamadı.</p>';
        }
    }
    updateModalContentWithUser(username);
    // modalBody.innerHTML = `
    //     <p>Modal içeriği buraya gelecek</p>
    // `;
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    const closeButtonFooter = document.createElement('button');
    closeButtonFooter.setAttribute('type', 'button');
    closeButtonFooter.classList.add('btn', 'btn-secondary');
    closeButtonFooter.setAttribute('data-dismiss', 'modal');
    closeButtonFooter.textContent = 'Close';

    modalFooter.appendChild(closeButtonFooter);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    modalDialog.appendChild(modalContent);
    document.body.appendChild(modalDialog);

    // Modalı kapattığınızda backdrop ve modalı kaldırın
    const closeButtonListener = () => {
        modalBackdrop.remove();
        modalDialog.remove();
    };
    closeButtonFooter.addEventListener('click', closeButtonListener);
    eventListenersFriendsAll.push({ closeButtonFooter, closeButtonListener });
}



async function getSomeone(searchTerm) {
    const endpoint = 'http://localhost:8000/api/users';
    const url = `${endpoint}?searchTerm=${encodeURIComponent(searchTerm)}`;
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
        const person = await response.json();
        console.log('The person : ', person);
    }
    catch (error) {
        console.error('An error occurred while updating profile');
    }
} 

