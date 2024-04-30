import { translate } from '../translations';
import { navigate } from '../routes/routes';
import imageGame from '../assets/imageGame.png';
import { changeLanguage } from './dashboard';

export default function Game() {
    const pageElement = document.createElement('div');
    pageElement.className = 'vh-100';
    pageElement.innerHTML = `
        <h3 id="gameHeader" class="p-4 text-custom-light">Game</h3>
        <div class="text-center">
        <div class="game-container mx-auto position-relative mt-5 border border-light rounded"
            style="width: 80%; height: 500px;
            background-image: url(${imageGame});
            background-size: cover;
            background-position: center;">
                <!-- Ayarlar Butonu -->
                <div class="settings-button position-absolute" style="bottom: 0; width: 100%;">
                <div>
                    <button 
                        <a id="localgametext" href="/localgame" class="game-btn btn btn-secondary
                        btn-lgborder border-dark rounded mb-3" style="border-width: 3px;">
                        Local Game
                        </a>
                    </button>
                </div>
                <div>
                    <button
                        <a id="aigametext" href = "/aigame" class="game-btn btn btn-secondary
                        btn-lgborder border-dark rounded mb-3"
                        style="border-width: 3px;">
                        Play with AI
                        </a>
                    </button>
                </div>
                <div>
                    <button
                    <a id="tournamentgametext" href = "/tournamentgame" class="game-btn btn btn-secondary
                    btn-lgborder border-dark rounded  mb-3" style="border-width: 3px;">
                        Tournament Mode
                    </a>
                    </button>
                </div>
            <div id="page-title" class="px-2"></div>
            <div id="page-main" class="mx-2"></div>
        </div>
    `;
    return pageElement;
}

document.addEventListener('languageChange', (e) => {
    const f1 = document.getElementById('gameHeader');
    if(f1) f1.textContent = e.detail.lang.game;
    const f2 = document.getElementById('localgametext');
    if(f2) f2.textContent = e.detail.lang.localGame;
    const f3 = document.getElementById('aigametext');
    if(f3) f3.textContent = e.detail.lang.playWithAI;
    const f4 = document.getElementById('tournamentgametext');
    if(f4) f4.textContent = e.detail.lang.tournamentMode;
});

export function initGameEvents() {
    const selectedLanguage = JSON.parse(localStorage.getItem('theLanguage'));
    changeLanguage(selectedLanguage);

    const gameElement = document.querySelectorAll('.game-btn');
    gameElement.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            gameElement.forEach((otherLink) => {
                otherLink.classList.remove('active');
            });
            link.classList.add('active');
            const selectedPath = link.getAttribute('href'); // Remove leading slash
            handleNavigation(selectedPath);
        });
    });

    function handleNavigation(path) {
        console.log('Navigating to:', path);
        switch (path) {
            case '/localgame':
                navigate(true, '/localgame', 'page-main');
                break;
            case '/tournamentgame':
                navigate(true, '/tournamentgame', 'page-main');
                break;
            case '/aigame':
                navigate(true, '/aigame', 'page-main');
                break;
            default:
                console.log('Unknown path:', path);
                break;
        }
    }
}