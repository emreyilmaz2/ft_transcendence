import ecole from '../../assets/ecole.jpeg';
import { navigate } from '../../routes/routes.js';
import { checkLoginStatus } from '../../static/app.js';

const eventListeners = [];
let isLoggedIn = false;

export default function Login() {
    const pageElement = document.createElement('div');
    pageElement.className = 'vh-100';
  
    pageElement.innerHTML = `
  <div id="page-main" class="mx-2">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-10 col-lg-12 col-md-9">
          <div class="card o-hidden border-0 shadow-lg my-5">
            <div class="card-body p-0">
              <div class="row-center">
                <div class="col-lg-5 d-sm-block bg-login-image mx-auto">
                  <div class="card">
                    <img
                      id="bg-42-ecole"
                      class="card-img-center mt-5"
                      alt="Card image cap"
                      src="${ecole}"
                    />
                  </div>
                </div>
                <div class="col-lg-6 d-sm-block bg-login-image mx-auto">
                  <div class="p-5">
                    <form class="user" id="login-form">
                      <div class="form-group mb-2">
                        <label for="username">Username</label>
                        <input
                          type="username"
                          class="form-control form-control-user"
                          id="username"
                          name="username"
                          required
                          autocomplete="on"
                          />
                          </div>
                          <div class="form-group mb-2">
                          <label for="password">Password </label>
                          <input
                          type="password"
                          class="form-control form-control-user"
                          id="password"
                          name="password"
                          required
                          autocomplete="on"
                        />
                      </div>
                      <button
                        type="submit"
                        class="btn btn-secondary btn-user btn-block col-md-12 mt-2"
                      >
                        Login
                      </button>

                    </form>
                    <button
                    type="submit"
                    id= "login42" 
                    class="btn btn-outline-secondary btn-user btn-block col-md-12 mt-2"
                  >
                    42
                  </button>
                    <hr />
                    <div class="text-center">
                      <a class="small" href="/register">Create New Account</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
    return pageElement;

}

export async function destroyLoginEvents() {
    eventListeners.forEach(({ element, type, listener }) => {
        element.removeEventListener(type, listener);
    });
}

export function initLoginEvents() {
    const loginForm = document.querySelector('#login-form');
    const registerLink = document.querySelector('a.small');
    const login42=document.getElementById('login42');

    // 42 Api ile giris yapmak isterken tiklanilan butonu dinleyen eventListener
    const login42ClickListener = async () => {
        redirectTo42OAuth();
    };
    const loginFormSubmitHandler = async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value; // username değerini al
        const password = document.getElementById('password').value; // Password değerini al
        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                console.error('Giriş başarısız.');
                const errorData = await response.json(); // Hata mesajını al
                alert(errorData.error); // Hata mesajını kullanıcıya göster
            } else {
                const data = await response.json();
                console.log('Login successful:', data);
                localStorage.setItem('tmpUser', JSON.stringify(data));
                localStorage.setItem('tmpAccessToken', data.access); // Erişim token'ını kaydet
                const isLogin = checkLoginStatus();
                localStorage.setItem('updatePath', '/dashboard');
                
                loginForm.addEventListener('click',modalcreateLogin);
                modalcreateLogin();
                //navigate(isLogin,'/dashboard','app'); // Kullanıcıyı dashboard'a yönlendir
            }
        } catch (error) {
            console.error('Error:', error);
        }};
    loginForm.addEventListener('submit', loginFormSubmitHandler);
    login42.addEventListener('click', login42ClickListener);

    eventListeners.push({ element: loginForm, type: 'submit', listener: loginFormSubmitHandler });
    eventListeners.push({ element: login42, type: 'click', listener: login42ClickListener });
    // Register link event listener'ını oluşturun ve diziye ekleyin
    const registerLinkClickHandler = (event) => {
        event.preventDefault();
        const isLogin = checkLoginStatus();
        navigate(isLogin,'/register','app'); // Kullanıcıyı dashboard'a yönlendir
    };
    registerLink.addEventListener('click', registerLinkClickHandler);
    eventListeners.push({ element: registerLink, type: 'click', listener: registerLinkClickHandler });
}

async function modalcreateLogin() {

    try{
        const response = await fetch('http://localhost:8000/api/send-otp/', {
            method: 'POST',
            headers:
        {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('tmpAccessToken')}`,
        },
            body: JSON.stringify({
                type: 'send',
            })
        });
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        else{
            console.log('Mail gönderildi:', response);

        }
    } catch (error) {
        console.error('Error sending mail:', error);
    }


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
    modalContent.style.maxWidth = '40%'; // Modal içeriğinin maksimum genişliğini belirleyin
    modalContent.style.margin = '0 auto'; // Modalı ortalamak için margin ekleyin

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    const modalTitle = document.createElement('h5');
    modalTitle.classList.add('modal-title');
    modalTitle.setAttribute('id', 'exampleModalCenter');
    modalTitle.textContent = 'Verification Code';
    modalTitle.style.width = '100%'; // Başlığın genişliğini ayarlayın
    modalTitle.style.textAlign = 'center'; // Başlığı ortalamak için stil ekleyin

    modalHeader.appendChild(modalTitle);

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.style.fontSize = '18px';
    modalBody.style.textAlign = 'center';
    modalBody.style.fontWeight = 'bold';
    // Modal içeriği buraya eklenecek
    modalBody.innerHTML = `
      <p>Please enter the code:</p>
      <input type="text" id="verificationCode" placeholder="Enter the code">
      <button onclick="verifyCode()" class="verify-button" 
        style="padding: 10px 20px;font-size: 16px; background-color: #05803c; color: #fff; 
        border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;">Confirm
      </button>
  `;
  
    async function verifyCode() {
        const verificationCode = document.getElementById('verificationCode').value;
        try {
            const response = await fetch('http://localhost:8000/api/send-otp/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('tmpAccessToken')}`,
                },
                body: JSON.stringify({
                    type: 'verify',
                    code: verificationCode,
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            localStorage.setItem('user', localStorage.getItem('tmpUser'));
            localStorage.setItem('accessToken', localStorage.getItem('tmpAccessToken'));
            localStorage.removeItem('tmpUser');
            localStorage.removeItem('tmpAccessToken');
            
            modalBackdrop.remove();
            modalDialog.remove();
            navigate(true, '/dashboard', 'app');
        } catch (error) {
            console.error('Error verifying code:', error);
        }
    }

    window.verifyCode = verifyCode;

    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    const closeButtonFooter = document.createElement('button');
    closeButtonFooter.setAttribute('type', 'button');
    closeButtonFooter.classList.add('btn', 'btn-secondary','btn-m');
    closeButtonFooter.setAttribute('data-dismiss', 'modal');
    closeButtonFooter.textContent = 'Close';

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
    });
}

// 42 Api ile giris yapilirken kullanilan fonksiyonlar
function redirectTo42OAuth() {
    const client_id = 'u-s4t2ud-052c281485c3d61fd33a1aac8c4e4e06a46fe52850875aa261a9a06d98911820';
    const redirect_uri = 'https://localhost:443';
    const scope = 'public';
    const state = 'some_random_string'; // CSRF koruması için güvenli bir rastgele dize olmalıdır.
    const auth_url = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${scope}&state=${state}`;
    window.location.href = auth_url;
}
function handle42OAuthResponse() {
    // URL'den code parametresini alın
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        // Backend'e POST isteği gönderin ve JWT tokenları alın
        fetch('http://localhost:8000/api/42-api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: `code=${code}`
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Authentication failed');
                }
                return response.json();
            })
            .then(data => {
                // JWT tokenları kullanın (örneğin localStorage'a kaydedin)
                localStorage.setItem('accessToken', data.accessToken);
                navigate(true, '/dashboard', 'app');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        console.log('No code parameter in URL');
    }
}
// Sayfa yüklendiğinde OAuth cevabını işleyin
window.onload = function() {
    handle42OAuthResponse();
};