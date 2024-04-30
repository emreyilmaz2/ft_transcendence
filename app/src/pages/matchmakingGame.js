// matchmakingGame.js
import { translate } from '../translations';
import { navigate } from '../routes/routes';


export default function MatchmakingGame() {
    const pageElement = document.createElement('div');
    pageElement.className = 'vh-100 d-flex justify-content-center align-items-center';

    // LocalStorage'dan oyuncu isimlerini al ve bir diziye dönüştür
    const playerNames = JSON.parse(localStorage.getItem('playerNames')) || {};
    let players = [playerNames.player1NameT, playerNames.player2NameT, playerNames.player3NameT, playerNames.player4NameT];

    localStorage.setItem('Playerss', JSON.stringify(players));

    pageElement.innerHTML = `
    <div class="container mt-5">
    <div class="row justify-content-center">
    <!-- Maç 1 -->
      <div class="col-md-4">
        <div class="card mb-3">
          <div class="card-body text-center">
            <h5 class="card-title">Maç 1</h5>
            <p class="card-text">${players[0]} vs ${players[1]}</p>
          </div>
        </div>
      </div>
      <!-- Maç 2 -->
      <div class="col-md-4">
        <div class="card mb-3">
          <div class="card-body text-center">
            <h5 class="card-title">Maç 2</h5>
            <p class="card-text">${players[2]} vs ${players[3]}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Final Maçı -->
    <div class="row justify-content-center">
    <div class="col-md-8">
        <div class="card">
          <div class="card-body text-center">
            <h5 class="card-title">Final Maçı</h5>
            <p class="card-text">Maç 1 Kazananı: ${localStorage.getItem('match1Winner') || '-'}</p>
            <p class="card-text">Maç 2 Kazananı: ${localStorage.getItem('match2Winner') || '-'}</p>
            </div>
            </div>
            <div class="d-flex justify-content-center">
            <button id="startButton" class="btn btn-outline-success btn-lg mt-3">
                ${translate('Start')}
            </button>
        </div>
  </div>
`;

    return pageElement;
}


export function initMatchmakingGameEvents() {


    let players = JSON.parse(localStorage.getItem('Playerss')) || [];

    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {

        let currentRound = parseInt(localStorage.getItem('tournamentRound')) || 0; 

        currentRound += 1; // Sayısal olarak artırma
        localStorage.setItem('tournamentRound', currentRound.toString()); 

        console.log('Round:', currentRound - 1); 
        console.log('CurrentRound:', currentRound);

        if (currentRound === 1) {
            console.log('ROUND1');
            localStorage.setItem('player1NameT', JSON.stringify(players[0]));
            localStorage.setItem('player2NameT', JSON.stringify(players[1]));

            console.log('player1NameT',localStorage.getItem('player1NameT'));
            console.log('player2NameT',localStorage.getItem('player2NameT'));

            navigate(true, '/ponggamet', 'page-main');
        } else if (currentRound === 2) {
            console.log('ROUND2');
            localStorage.setItem('player3NameT', JSON.stringify(players[2]));
            localStorage.setItem('player4NameT', JSON.stringify(players[3]));
            navigate(true, '/ponggamet', 'page-main');

        } else if (currentRound === 3) {
            navigate(true, '/ponggamet', 'page-main');
        }
    });
}
