import { navigate } from '../routes/routes';
import { changeLanguage } from './dashboard';

export default function LocalGame() {
    // Kullanıcı adını Local Storage'dan al
    const loggedInUser = localStorage.getItem('PlayerName');

    const pageElement = document.createElement('div');
    pageElement.className = 'vh-100 d-flex justify-content-center align-items-center'; // Merkezi hizalama için Bootstrap sınıfları

    pageElement.innerHTML = `
    <div class="container">
        <div class="row">
            <div class="col-md-6 offset-md-3">
                <div class="card shadow bg-secondary">
                    <div class="card-body">
                        <h1 id="heading" class="card-title text-center">Welcome to Ping Pong!</h2>
                        <p class="text-center">
                            <span style="color: white; font-size: 1.2em; font-weight: bold;">${loggedInUser}</span> 
                            <br>
                            vs 
                            <span class="text-muted"></span>
                        </p>

                        <form id="localGameForm" class="needs-validation" novalidate>
                            <div class="mb-3">
                                <input type="text" class="form-control" id="player2Name" placeholder="Player 2 Name" required>
                                <div class="invalid-feedback">Please provide Player 2's name.</div>
                            </div>
                            <div class="d-grid">
                                <button id="startButton" type="submit" class="btn bg-light bg-gradient btn-lg border border-dark rounded">
                                Start</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    return pageElement;
}

document.addEventListener('languageChange', (e) => {
    const welcomeMes = document.getElementById('heading');
    if(welcomeMes) welcomeMes.innerText = e.detail.lang.welcomeMessage;
    const player2Name = document.getElementById('player2Name');
    if(player2Name) player2Name.placeholder = e.detail.lang.player2Name;
    var invalidFeedback = document.querySelector('.invalid-feedback');
    if(invalidFeedback) invalidFeedback.innerText = e.detail.lang.player2NamePrompt;
    const startButton = document.getElementById('startButton');
    if(startButton) startButton.innerText = e.detail.lang.startButton;
});

export async function initLocalGameEvents() {
    const selectedLanguage = JSON.parse(localStorage.getItem('theLanguage'));
    changeLanguage(selectedLanguage);

    const localGameForm = document.getElementById('localGameForm');
    if (!localGameForm) {
        console.log('Form not found');
        return; // Form bulunamazsa işlevi erken sonlandır
    }

    localGameForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const loggedInUser = localStorage.getItem('PlayerName');
        if (!loggedInUser) {
            alert('Please log in to start the game.'); // Kullanıcı girişi kontrolü
            return;
        }

        const player2Name = document.getElementById('player2Name').value;
        if (!player2Name) {
            document.getElementById('player2Name').classList.add('is-invalid');
            return; // Oyuncu adı girilmediyse işlemi sonlandır
        }
        localStorage.setItem('player1Name', loggedInUser);
        localStorage.setItem('player2Name', player2Name);
        
        navigate(true, '/ponggame', 'page-main'); // Başarılı sonuç sonrası yönlendirme
    });
}
