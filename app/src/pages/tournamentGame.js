import { translate } from '../translations';
import { changeLanguage } from './dashboard';
import { navigate } from '../routes/routes';

export default function TournamentGame() {
    const loggedInUser = localStorage.getItem('PlayerName');
    const pageElement = document.createElement('div');
    pageElement.className = 'vh-100 d-flex justify-content-center align-items-center'; // Merkezi hizalama için Bootstrap sınıfları
    pageElement.innerHTML = `
    <div class="container">
    <div class="row">
        <div class="col-md-6 offset-md-3">
            <div class="card shadow bg-secondary">
                <div class="card-body">
                    <h1 id="opening_message" class="card-title text-center">Welcome to Ping Pong!</h1>
                    <p class="text-center">
                        <span style="color: white; font-size: 1.2em; font-weight: bold;">${loggedInUser}</span> 
                        <br>
                        vs
                        <span class="text-muted"></span>
                    </p>
                    <form id="tournamentGameForm" class="needs-validation" novalidate>
                        <div class="mb-3">
                            <input type="text" class="form-control" id="player2NameT" placeholder="Player 2 Name" required>
                            <div class="invalid-feedback">Please provide this Player's name.</div>
                        </div>
                        <div class="mb-3">
                            <input type="text" class="form-control" id="player3NameT" placeholder="Player 3 Name" required>
                            <div class="invalid-feedback">Please provide this Player's name.</div>
                        </div>
                        <div class="mb-3">
                            <input type="text" class="form-control" id="player4NameT" placeholder="Player 4 Name" required>
                            <div class="invalid-feedback">Please provide this Player's name.</div>
                        </div>
                        <div class="d-grid">
                        <button id="goButton" type="submit" class="btn bg-light bg-gradient btn-lg border border-dark rounded">
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
    const f4 = document.getElementById('opening_message');
    if(f4) f4.textContent = e.detail.lang.welcomeMessage;
    const player2Name = document.getElementById('player2NameT');
    if(player2Name) player2Name.placeholder = e.detail.lang.player2Name;
    const player3Name = document.getElementById('player3NameT');
    if(player3Name) player3Name.placeholder = e.detail.lang.player3Name;
    const player4Name = document.getElementById('player4NameT');
    if(player4Name) player4Name.placeholder = e.detail.lang.player4Name;
    var invalidFeedback = document.querySelector('.invalid-feedback');
    if(invalidFeedback) invalidFeedback.innerText = e.detail.lang.playerRandomNamePrompt;
    const goButton = document.getElementById('goButton');
    if(goButton) goButton.innerText = e.detail.lang.startButton;
});

export async function initTournamentGameEvents() {
    const selectedLanguage = JSON.parse(localStorage.getItem('theLanguage'));
    changeLanguage(selectedLanguage);

    const tournamentGameForm = document.getElementById('tournamentGameForm');
    if (!tournamentGameForm) {
        console.log('Form not found');
        return;
    }

    tournamentGameForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const loggedInUser = localStorage.getItem('PlayerName');
        if (!loggedInUser) {
            alert('Please log in to start the game.');
            return;
        }
    
        const player2NameT = document.getElementById('player2NameT').value;
        const player3NameT = document.getElementById('player3NameT').value;
        const player4NameT = document.getElementById('player4NameT').value;
    
        if (!player2NameT || !player3NameT || !player4NameT) {
            document.getElementById('player2NameT').classList.add('is-invalid');
            document.getElementById('player3NameT').classList.add('is-invalid');
            document.getElementById('player4NameT').classList.add('is-invalid');
            return;
        }
    
        // Oyuncu isimlerini localStorage'a kaydet
        localStorage.setItem('playerNames', JSON.stringify({
            player1NameT: loggedInUser,
            player2NameT,
            player3NameT,
            player4NameT
        }));

        localStorage.setItem('tournamentRound',0);
    
        navigate(true, '/match', 'page-main');
    });
}
