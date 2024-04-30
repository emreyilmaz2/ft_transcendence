import { navigate } from '../routes/routes';
import { changeLanguage } from './dashboard';

export default function AIGame() {
    const loggedInUser = localStorage.getItem('PlayerName');
    const pageElement = document.createElement('div');
    pageElement.className = 'vh-100 d-flex justify-content-center align-items-center'; // Merkezi hizalama için Bootstrap sınıfları
    pageElement.innerHTML = `
    <div class="container">    <div class="container">
    <div class="row">
        <div class="col-md-6 offset-md-3">
            <div class="card shadow bg-secondary">
                <div class="card-body">
                    <h1 id="heading" class="card-title text-center">Welcome to Ping Pong!</h1>
                    <p class="text-center">
                            <span style="color: white; font-size: 1.2em; font-weight: bold;">${loggedInUser}</span> 
                            <br>
                            vs 
                            <br>
                            <span id= "ai" style="color: white; font-size: 1.2em; font-weight: bold;">AI</span> 

                            <span class="text-muted"></span>
                        </p>
                    <div class="d-grid">
                        <button id="goButton" type="submit" class="btn bg-light bg-gradient btn-lg border border-dark rounded">Go!</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

    `;  
    return pageElement;
}
document.addEventListener('languageChange', (e) => {
    const t1 = document.getElementById('readyText');
    if(t1) t1.innerText = e.detail.lang.readyText;
    const t2 = document.getElementById('goButton');
    if(t2) t2.innerText = e.detail.lang.startButton;
    const t3 = document.getElementById('ai');
    if(t3) t3.innerText = e.detail.lang.AI;
});

export function initAIGameEvents() {
    // Set the default language
    const selectedLanguage = JSON.parse(localStorage.getItem('theLanguage'));
    changeLanguage(selectedLanguage);

    const goButton = document.getElementById('goButton');
    if (goButton) {
        goButton.addEventListener('click', () => {
            // Kullanıcı adını ve oyun başlatma bilgisini Local Storage'a kaydet
            const player1Name = localStorage.getItem('PlayerName');
            const player2Name = 'AI';

            // Oyun başlatma bilgisini konsolda göster
            console.log(`AI Game started with: ${player1Name}`);

            localStorage.setItem('player1Name', player1Name);
            localStorage.setItem('player2Name', player2Name);

            // '/ponggame' sayfasına yönlendir
            if (player1Name) {
                navigate(true, '/pongAI', 'page-main');
            }
        });
    } else {
        console.log('Go button not found');
    }
}
