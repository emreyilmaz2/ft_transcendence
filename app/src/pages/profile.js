import { navigate } from '../routes/routes';
import { changeLanguage } from './dashboard';

export default function Profile() {
    const pageElement = document.createElement('div');
    pageElement.innerHTML = `
    <h3 id="profileHeader" class="p-4 text-custom-light">Profile</h3>
    <div class="text-center">
        <div class="profile-container">
            <img id="profilePhoto" src="" alt="Profil Fotoğrafı" style="width: 200px; height: 200px; border-radius: 50%;">
            <h2 class="text-custom-light" id="profile_fullname"></h2>
        
            <!-- Ayarlar Butonu -->
            <div class="settings-button mb-3">
                <a id="settingsButtonName" href="/profilesetting" class="btn btn-secondary">Ayarlar</a>
            </div> 
        </div>

        <!-- Maç İstatistikleri -->
        <div class="match-stats margin-top=20px">
            <h3 class="text-custom-light" id="matchStatisticsHeader">Maç İstatistikleri</h3>
            <p class="text-custom-light" id="winCount">Kazanılan: 0</p>
            <p class="text-custom-light" id="lossCount">Kaybedilen: 0</p>
            <p class="text-custom-light" id="totalMatchCount">Toplam Maç: 0</p>
            <!-- Grafik Bölümü -->
            <div class="progress" id="matchStatisticsProgress">
                <div class="progress-bar bg-success" id="winProgressBar" role="progressbar" aria-valuenow="0" 
                aria-valuemin="0" aria-valuemax="100">Kazanılan: 0</div>
                <div class="progress-bar bg-danger" id="lossProgressBar" role="progressbar" aria-valuenow="0" 
                aria-valuemin="0" aria-valuemax="100">Kaybedilen: 0</div>
            </div>
        </div>
        <!-- Maç Geçmişi -->
        <div class="match-history margin-top=20px">
            <h3 id="matchHistoryText" class="text-custom-light">Maç Geçmişi</h3>
            <table class="table">
                <thead id="myThead">
                    <tr>
                        <th>Oyuncular</th>
                        <th>Skor</th>
                        <th>Maç Tarihi</th>
                    </tr>
                </thead>
                <tbody id="matchHistoryTableBody">
                    <!-- Maç geçmişi dinamik olarak buraya eklenecek -->
                </tbody>
            </table>
        </div>
    </div>
    `;
    return pageElement;
}
const eventListenersProfile = []; // Listener'ları saklamak için bir dizi oluşturun
document.addEventListener('languageChange', (e) => {
    const profileHeader = document.getElementById('profileHeader');
    if (profileHeader) profileHeader.innerText = e.detail.lang.profile;
    const settingsButtonName = document.getElementById('settingsButtonName');
    if (settingsButtonName) settingsButtonName.innerText = e.detail.lang.settings;
    const matchStatisticsHeader = document.getElementById('matchStatisticsHeader');
    if (matchStatisticsHeader) matchStatisticsHeader.innerText = e.detail.lang.matchStatisticsHeader;
    // Asenkron IIFE kullanımı
    (async () => {
        try {
            const matchHistory = await fetchMatchHistory();
            const matchStatistics = await fetchMatchStatistics(matchHistory);
            if(e.detail.lang) updateMatchStatistics(matchStatistics, e.detail.lang);
        } catch (error) {
            console.error('Profil bilgileri yüklenirken bir hata oluştu:', error);
        }
    })();
    const matchHistoryText = document.getElementById('matchHistoryText');
    if (matchHistoryText) matchHistoryText.innerText = e.detail.lang.matchHistory;
    
    let newHeaderContent;
    if(e.detail.lang)
        newHeaderContent = `<tr><th>${e.detail.lang.players}</th><th>${e.detail.lang.score}</th><th>${e.detail.lang.matchDate}</th></tr>`;
    const thead = document.querySelector('#myThead'); // ID ile doğru bir şekilde seçim yapılır
    if (thead) thead.innerHTML = newHeaderContent; // innerHTML ile içerik güncellenir
});


async function fetchMatchHistory() {
    try {
        const response = await fetch('http://localhost:8000/api/match/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const matchHistory = await response.json();

        return matchHistory;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function fetchMatchStatistics(matchHistory) {
    try {
        const totalMatches = matchHistory.length;
        let winCount = 0;
        let lossCount = 0;

        matchHistory.forEach(match => {
            if (match.result === 'win') {
                winCount++;
            } else if (match.result === 'loss') {
                lossCount++;
            }
        });

        const matchStatistics = {
            totalMatchCount: totalMatches,
            winCount,
            lossCount
        };

        return matchStatistics;
    } catch (error) {
        console.error('Error:', error);
        return { totalMatchCount: 0, winCount: 0, lossCount: 0 };
    }
}

function updateMatchStatistics(matchStatistics, lang) {
    const winCount = document.getElementById('winCount');
    if(winCount) winCount.textContent = `${lang.winCount}: ${matchStatistics.winCount}`;
    const lossCount = document.getElementById('lossCount');
    if(lossCount) lossCount.textContent = `${lang.lossCount}: ${matchStatistics.lossCount}`;
    const totalMatchCount = document.getElementById('totalMatchCount');
    if(totalMatchCount) totalMatchCount.textContent = `${lang.totalMatchCount}: ${matchStatistics.totalMatchCount}`;

    const winPercentage = (matchStatistics.winCount / matchStatistics.totalMatchCount) * 100;
    const lossPercentage = (matchStatistics.lossCount / matchStatistics.totalMatchCount) * 100;
    const winProgressBar = document.getElementById('winProgressBar');
    if(winProgressBar){
        winProgressBar.style.width = `${winPercentage}%`;
        winProgressBar.textContent = `${lang.winCount}: ${matchStatistics.winCount}`;
    }

    const lossProgressBar = document.getElementById('lossProgressBar');
    if(lossProgressBar){
        lossProgressBar.style.width = `${lossPercentage}%`;
        lossProgressBar.textContent = `${lang.lossCount}: ${matchStatistics.lossCount}`;
    }
}

export async function initProfileEvents() {
    const selectedLanguage = JSON.parse(localStorage.getItem('theLanguage'));
    changeLanguage(selectedLanguage);
    const settingsButton = document.querySelector('.settings-button a');
    
    const settingsButtonClickHandler = function(event) {
        event.preventDefault(); // Varsayılan davranışı engelle
        navigate(true, '/profilesetting', 'page-main'); // SPA yönlendirme fonksiyonunu çağır
    };
    // Etkinleştirme işlevi
    settingsButton.addEventListener('click', settingsButtonClickHandler);
    // Tanımladığınız listener'ı diziye ekleyin
    eventListenersProfile.push({ settingsButton, settingsButtonClickHandler });

    try {
        const matchHistory = await fetchMatchHistory();
        const matchStatistics = await fetchMatchStatistics(matchHistory);

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
        const data = await response.json();
        console.log('Profile:', data);
        localStorage.setItem('Profile', JSON.stringify(data));
    
        // Profil resmini ayarlama
        let imageUrl;
        if(data.normal_avatar){
            //imageUrl = `http://localhost:8000${data.normal_avatar}`;
            imageUrl = data.normal_avatar;
        }
        else if(data.intra_avatar){
            imageUrl = data.intra_avatar;
        }
        document.getElementById('profilePhoto').src = imageUrl;
        
        // Username i ayarlama
        const userFullNameElement = document.getElementById('profile_fullname');
        if(userFullNameElement){
            userFullNameElement.textContent = `${data.first_name} ${data.last_name}`;
        }
        // Maç geçmişini al ve tabloyu güncelle
        updateMatchHistoryTable(matchHistory);
        // // Maç istatistiklerini güncelle, zaten init basinda giden updateLang yaptigi icin kaldirdim.
        // updateMatchStatistics(matchStatistics);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateMatchHistoryTable(matchHistory) {
    try {
        const tableBody = document.getElementById('matchHistoryTableBody');
        tableBody.innerHTML = ''; // Tabloyu temizle

        matchHistory.forEach(match => {
            const row = document.createElement('tr');

            const playersCell = document.createElement('td');
            playersCell.textContent = `${match.player1} vs ${match.player2}`;
            row.appendChild(playersCell);

            const scoreCell = document.createElement('td');
            scoreCell.textContent = match.score;
            row.appendChild(scoreCell);

            const dateCell = document.createElement('td');
            dateCell.textContent = match.match_date;
            row.appendChild(dateCell);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
