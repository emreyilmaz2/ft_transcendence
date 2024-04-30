import * as THREE from 'three';
import { navigate } from '../routes/routes';

export default function pongGame() {
    const pageElement = document.createElement('div');
    pageElement.style.display = 'flex';
    pageElement.style.justifyContent = 'center';
    pageElement.style.alignItems = 'center';
    pageElement.style.height = '100vh';
    pageElement.innerHTML = `
        <div id="game" style="width: 60%; height: 80vh; background-color: #000;">
            <!-- Skor tablosu -->
            <div id="scoreboard" style="position: absolute; top: 100px; color: white; font-size: 35px;" </div>
        </div>
    `;
    return pageElement;
}

export function runGameAI() {

    console.log('Game is running');
    let renderWidth = window.innerWidth / 2;
    let renderHeight = window.innerHeight / 2;

    // Camera settings
    let fov = 55;
    let nearClipping = 0.5;
    let farClipping = 1000;
    let cameraYPos = -20;
    let cameraZPos = 80;
    let cameraXRot = 0.60;

    // Plane (board) settings
    let planeWidth = renderWidth * 0.11;
    let planeHeight = renderHeight * 0.12;
    let planeYPos = planeHeight / 2;
    let planeColor = 0x1b59f5;

    // Left wall --> NOT DONE!!!!!!!!
    let lWallHeight = 20;
    let lWallWidth = planeHeight;
    let lWallXPos = planeWidth / 2 * -1;

    // Light settings
    let lightColor = 0xFFFFFF;
    let lightZPos = 100;
    let lightYPos = planeYPos;
    let lightAngle = 0.9;
    let lightPenumbra = 0.4;
    let lightIntensity = 30000;

    // Elements common settings
    let elementsZPos = 3;
    let elementsYPos = planeYPos;

    // Players settings
    let playersRadius = 1.2;
    let playersLength = planeHeight * 0.2;
    let playersCapSegments = 30;
    let playersRadialSegments = 30;
    let playerOneColor = 0x1E1E1E;
    let playerTwoColor = 0xFF0000;
    let playerTwoXPos = (planeWidth / 2) - 5;
    let playerTwoYPos = planeYPos;
    let playerOneXPos = playerTwoXPos * -1;
    let playerOneYPos = planeYPos;

    // Ball settings
    let ballRadius = 1;
    let ballTubeRadius = 0.5;
    let ballTotalRadius = ballRadius + ballTubeRadius;
    let ballRadialSegments = 15;
    let ballArc = 40;
    let ballColor = 0xFFA200;
    let ballYPos = elementsYPos;

    // Interaction limits
    let gameLimitsY = planeHeight - ballTotalRadius;
    let gameLimitsX = planeWidth / 2 + ballTotalRadius;

    // ---------- RENDERER AND CAMERA ----------
    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(renderWidth, renderHeight);

    //document.body.appendChild(renderer.domElement)
    const container = document.getElementById('game');
    container.appendChild(renderer.domElement);

    /*     let container = document.getElementById('gameDiv');
    container.parentElement.appendChild(renderer.domElement); */


    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e1e1e);
    const camera = new THREE.PerspectiveCamera(
        fov,
        window.innerWidth / window.innerHeight,
        nearClipping,
        farClipping
    );

    camera.position.set(0, cameraYPos, cameraZPos);
    camera.rotation.set(cameraXRot, 0, 0);

    // ---------- DEVELOPING HELPERS ----------
    // const orbit = new OrbitControls(camera, renderer.domElement);
    // orbit.update();
    // const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);
    // ---------- DEVELOPING HELPERS ----------

    // ---------- LIGTHS ----------
    const spotLight = new THREE.SpotLight(lightColor);
    scene.add(spotLight);
    spotLight.position.set(0, lightYPos, lightZPos);
    spotLight.castShadow = true;
    spotLight.angle = lightAngle;
    spotLight.penumbra = lightPenumbra;
    spotLight.intensity = lightIntensity;



    // ---------- GAME ELEMENTS ----------
    // Table
    const tableGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: planeColor, transparent: true });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(0, planeYPos, 0);
    table.receiveShadow = true;
    spotLight.target = table; // Adding table as the spotLight target
    scene.add(spotLight.target); // Adding the spotLight target element to the scene

    // --------- DEVELOPING HELPERS ----------
    // const sLightHelper = new THREE.SpotLightHelper(spotLight)
    // scene.add(sLightHelper)
    // ---------- DEVELOPING HELPERS ----------

    // Player One
    const pOneGeometry = new THREE.CapsuleGeometry(
        playersRadius,
        playersLength,
        playersCapSegments,
        playersRadialSegments
    );
    const pOneMaterial = new THREE.MeshStandardMaterial({ color: playerOneColor });
    const pOne = new THREE.Mesh(pOneGeometry, pOneMaterial);
    scene.add(pOne);
    pOne.position.set(playerOneXPos, elementsYPos, elementsZPos);
    pOne.castShadow = true;

    // Player Two
    const pTwoGeometry = new THREE.CapsuleGeometry(
        playersRadius,
        playersLength,
        playersCapSegments,
        playersRadialSegments
    );
    const pTwoMaterial = new THREE.MeshStandardMaterial({ color: playerTwoColor });
    const pTwo = new THREE.Mesh(pTwoGeometry, pTwoMaterial);
    scene.add(pTwo);
    pTwo.position.set(playerTwoXPos, elementsYPos, elementsZPos);
    pTwo.castShadow = true;

    // Ball
    console.log(window.innerWidth);
    const ballGeometry = new THREE.TorusGeometry(
        ballRadius,
        ballTubeRadius,
        ballRadialSegments,
        ballArc
    );
    const ballMaterial = new THREE.MeshStandardMaterial({ color: ballColor });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);
    ball.position.set(0, elementsYPos, elementsZPos);
    ball.castShadow = true;

    // Ball and Players control variables
    let speed = 1;
    let ballSpeed = 1.2;
    let ballStarted = false;
    let ballXDirection;
    let ballYDirection;
    let firstHit;
    let fisrtYDir;
    let pTwoImpact = false;
    let pOneImpact = false;

    // Points variables
    let p1Points = 0;
    let p2Points = 0;

    async function getStop() {
        const gameResult = `${p2Points} - ${p1Points}`;
        localStorage.setItem('gameResult', gameResult);

        const player1 = localStorage.getItem('player1Name');
        const player2 = localStorage.getItem('player2Name');
        const result = p1Points > p2Points ? 'loss' : 'win';
        const score = localStorage.getItem('gameResult');
        const match_date = new Date().toISOString().split('T')[0];
        try {
            const response = await fetch('http://localhost:8000/api/match/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({ player1, player2, score, result, match_date }),
            });
            if (!response.ok) {
                console.error('Kaydetme islemi basarisiz');
            } else {
                console.log('Kaydetme islemi basarili');
                // const data = await response.json();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function checkScoreAndEndGame() {
        if (p1Points >= 5 || p2Points >= 5) {
            // Oyunu sonlandır
            console.log('Oyun bitti.');
            renderer.setAnimationLoop(null);
            modalcreateLogin(p1Points, p2Points);
            getStop();
            // Başka bir sayfaya yönlendir
            //window.location.href = 'gameOverPage.html'; // gameOverPage.html yerine istediğiniz sayfa adresini yazın
        }
    }

    // Skoru güncelleme ve kontrol etme fonksiyonu


    // TEXT (Points)
    //function buildText() {
    //    // Skorları göstermek için metin oluştur
    //    const scoreText = `Player 1: ${p1Points} - Player 2: ${p2Points}`;
    //
    //    // Canvas üzerinde skor metnini oluşturacak fonksiyon
    //    function createTextTexture(text) {
    //        const canvas = document.createElement('canvas');
    //        const ctx = canvas.getContext('2d');
    //
    //        canvas.width = 1024; // Canvas genişliği
    //        canvas.height = 256; // Canvas yüksekliği
    //
    //        // Metin özelliklerini ayarla
    //        ctx.fillStyle = 'white'; // Metin rengi
    //        ctx.font = 'Bold 60px Arial'; // Metin fontu
    //        ctx.fillText(text, 50, 100); // Metni canvas üzerine çiz
    //
    //        // Canvas'tan bir texture oluştur
    //        const texture = new THREE.CanvasTexture(canvas);
    //
    //        // Texture için material oluştur
    //        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
    //
    //        // Mesh'i oluştur ve döndür
    //        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), material);
    //        mesh.scale.set(0.05, 0.05, 0.05); // Mesh'i küçült
    //
    //        return mesh;
    //    }
    //
    //    // Eski skor metni mesh'ini sahneden kaldır
    //    const oldScore = scene.getObjectByName('scoreText');
    //    if (oldScore) {
    //        scene.remove(oldScore);
    //    }
    //
    //    // Yeni skor metni mesh'ini oluştur ve sahneye ekle
    //    const scoreMesh = createTextTexture(scoreText);
    //    scoreMesh.name = 'scoreText'; // Mesh'e bir isim ver, böylece sonra erişilebilir
    //    scoreMesh.position.set(-4, 4, 0); // Mesh pozisyonunu ayarla
    //    scene.add(scoreMesh);
    //}

    // İlk skor metnini oluştur
    //buildText();
    const scoreboard = document.getElementById('scoreboard');
    const player1 = localStorage.getItem('player1Name');
    const player2 = localStorage.getItem('player2Name');
    if (scoreboard) {
        scoreboard.textContent = `${player2}: ${p2Points} - ${p1Points} :${player1} `;
    }


    // Oyun döngüsü veya skor güncelleme fonksiyonunuz içinde, skor değiştiğinde `buildText` fonksiyonunu çağırın
    // Örnek:
    /*     function updateScore(playerOneScore, playerTwoScore) {
        p1Points = playerOneScore;
        p2Points = playerTwoScore;
        buildText(); // Skoru güncelle
    } */

    // ---------- FUNCTIONS ----------
    let difficulty = 0.1; // Zorluk seviyesi, bu değer arttıkça yapay zeka topa daha hızlı tepki verir
    let paddleSpeed = 2; // Maksimum paddle hareket hızı

    let lastUpdateTime = 0; // Son güncelleme zamanını tutacak değişken
    const updateInterval = 1000; // Milisaniye cinsinden güncelleme aralığı (1000 ms = 1 saniye)

    let targetYDelta = 0; // Hedefe doğru hareket miktarı

    function predictBallFuturePosition(ball, deltaTime) {
        let futurePositionY = ball.position.y;
        let projectedVelocityY = ballSpeed;
        let reflectCount = 0;

        // Topun duvarlara çarpma durumunu simüle et
        for (let t = 0; t < deltaTime; t++) {
            futurePositionY += projectedVelocityY;

            // Topun alt veya üst duvara çarpma durumu
            if (futurePositionY <= 0 || futurePositionY >= planeHeight-2) {
                projectedVelocityY *= -1; // Yönü ters çevir
                reflectCount++;
                if (reflectCount >= 2) break; // Çok fazla yansıma önlemek için
            }
        }

        return futurePositionY;
    }

    function opponentPaddleMovement() {
        const now = Date.now();

        if (now - lastUpdateTime > updateInterval) {
            const deltaTime = (now - lastUpdateTime) / 1000; // Milisaniyeyi saniyeye çevir
            const predictedPosition = predictBallFuturePosition(ball, deltaTime);
            const targetY = (predictedPosition - pOne.position.y) * difficulty;
            targetYDelta = Math.sign(targetY) * Math.min(Math.abs(targetY), paddleSpeed);

            lastUpdateTime = now;
        }

        let newY = pOne.position.y + targetYDelta;
        newY = Math.max(newY, playersLength / 2); // Alt sınır
        newY = Math.min(newY, planeHeight - playersLength / 2); // Üst sınır
        pOne.position.y = newY;
    }
    function animate() {
        // Ball movement
        opponentPaddleMovement();
        if (!ballStarted) {
            Math.random() < 0.5 ? firstHit = -1 : firstHit = 1;
            Math.random() < 0.5 ? fisrtYDir = -1 : fisrtYDir = 1;

            ballXDirection = 0.5 * firstHit;
            let yDir;
            do {
                yDir = Math.random();
            } while (yDir > 0.6);
            ballYDirection = yDir * fisrtYDir;
            ballStarted = true;
        }
        if (ball.position.x >= gameLimitsX || ball.position.x <= - gameLimitsX) {
            if (ball.position.x >= gameLimitsX) {
                p1Points += 1;
            } else if (ball.position.x <= - gameLimitsX) {
                p2Points += 1;
            }
            checkScoreAndEndGame();
            ballStarted = false;
            ball.position.x = 0;
            ball.position.y = elementsYPos;
            pOne.position.y = elementsYPos;
            pTwo.position.y = elementsYPos;
            ballSpeed = 1.2;
            pOneImpact = false;
            pTwoImpact = false;
            let removePoints = scene.getObjectByName('p1Points');
            scene.remove(removePoints);
            removePoints = scene.getObjectByName('p2Points');
            scene.remove(removePoints);
            //buildText();
            const scoreboard = document.getElementById('scoreboard');
            if (scoreboard) {
                scoreboard.textContent = `${player2}: ${p1Points} - ${p2Points} :${player1}`;
            }
        }

        // Calculate collisions
        if (
            (ball.position.x - ballTotalRadius) <= (pOne.position.x + playersRadius) &&
            (ball.position.x - ballTotalRadius) >= (pOne.position.x - playersRadius) &&
            (ball.position.y) <= (pOne.position.y + (playersLength / 2) + 1) &&
            (ball.position.y) >= (pOne.position.y - (playersLength / 2) - 1) &&
            !pOneImpact
        ) {
            ballXDirection *= -1;
            let ballToPOneDist = ball.position.y - pOne.position.y;
            let normalizedDist = ballToPOneDist / (playersLength);
            ballYDirection = normalizedDist * 0.6;
            if (ballSpeed < 4) {
                ballSpeed += 0.1;
            }
            pOneImpact = true;
            pTwoImpact = false;
        }

        if (
            (ball.position.x + ballTotalRadius) >= (pTwo.position.x - playersRadius) &&
            (ball.position.x + ballTotalRadius) <= (pTwo.position.x + playersRadius) &&
            (ball.position.y) <= (pTwo.position.y + (playersLength / 2) + 1) &&
            (ball.position.y) >= (pTwo.position.y - (playersLength / 2) - 1) &&
            !pTwoImpact
        ) {
            ballXDirection *= -1;
            let ballToPTwoDist = ball.position.y - pTwo.position.y;
            let normalizedDist = ballToPTwoDist / (playersLength);
            ballYDirection = normalizedDist * 0.6;
            if (ballSpeed < 4) {
                ballSpeed += 0.1;
            }
            pTwoImpact = true;
            pOneImpact = false;
        }

        if (ball.position.y >= gameLimitsY || ball.position.y <= 0) {
            ballYDirection *= -1;
        }

        ball.position.x += ballXDirection * ballSpeed;
        ball.position.y += ballYDirection * ballSpeed;

        // ---------- TESING LOGS ----------
        // console.log(`Speed multiplier: ${ballSpeed}`);
        // console.log(`XMovement: ${ballXDirection * ballSpeed}`);
        // ---------- TESING LOGS ----------

        renderer.render(scene, camera);
    }
    let pOneDirection = 0; // -1 aşağı, 0 durma, 1 yukarı
    let pTwoDirection = 0; // -1 aşağı, 0 durma, 1 yukarı

    window.addEventListener('keydown', (e) => {
        if (e.key == 'W' || e.key == 'w') {
            pOneDirection = 1;
        } else if (e.key == 'S' || e.key == 's') {
            pOneDirection = -1;
        } else if (e.key == 'ArrowUp') {
            pTwoDirection = 1;
        } else if (e.key == 'ArrowDown') {
            pTwoDirection = -1;
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key == 'W' || e.key == 'w' || e.key == 'S' || e.key == 's') {
            pOneDirection = 0;
        } else if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
            pTwoDirection = 0;
        }
    });

    function update() {
        if (pOneDirection != 0) {
            let newY = pOne.position.y + (pOneDirection * speed);
            if (newY - playersLength / 2 > 0 && newY + playersLength / 2 < planeHeight) {
                pOne.position.y = newY;
            }
        }

        if (pTwoDirection != 0) {
            let newY = pTwo.position.y + (pTwoDirection * speed);
            if (newY - playersLength / 2 > 0 && newY + playersLength / 2 < planeHeight) {
                pTwo.position.y = newY;
            }
        }

        requestAnimationFrame(update); // Bu fonksiyonu animasyon döngüsünü devam ettirmek için çağırın
    }

    update(); // Animasyon döngüsünü başlat


    renderer.setAnimationLoop(animate);

}

async function modalcreateLogin(p1Points, p2Points) {
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
    modalContent.style.width = '50%';
    modalContent.style.margin = '0 auto';

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalHeader.style.display = 'flex';
    modalHeader.style.justifyContent = 'center';

    const modalTitle = document.createElement('h5');
    modalTitle.classList.add('modal-title');
    modalTitle.style.textAlign='center';
    modalTitle.setAttribute('id', 'exampleModalCenter');
    modalTitle.innerHTML = 'KAZANAN <i class="fas fa-trophy"></i>'; // Font Awesome ikonunu içeren HTML'i ekleyin

    modalHeader.appendChild(modalTitle);

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.style.fontSize = '18px';
    modalBody.style.textAlign = 'center';
    modalBody.style.fontWeight = 'bold';    
    // Modal içeriği buraya eklenecek
    let winner;
    if (p1Points < p2Points)
        winner=localStorage.getItem('player1Name');
    else if(p1Points > p2Points)
        winner=localStorage.getItem('player2Name');
    localStorage.setItem('winner', winner);
    modalBody.innerHTML = `
    <p>OYUNUN KAZANANI: ${winner}</p>
    `;
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    const closeButtonFooter = document.createElement('button');
    closeButtonFooter.setAttribute('type', 'button');
    closeButtonFooter.classList.add('btn', 'btn-secondary');
    closeButtonFooter.setAttribute('data-dismiss', 'modal');
    closeButtonFooter.textContent = 'Exit';

    modalFooter.appendChild(closeButtonFooter);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    modalDialog.appendChild(modalContent);
    document.body.appendChild(modalDialog);

    // Modalı kapattığınızda backdrop ve modalı kaldırın
    closeButtonFooter.addEventListener('click', () => {
        modalBackdrop.remove();
        modalDialog.remove();
        navigate(true, '/game', 'page-main');
    });
}