import ecole from '../../assets/ecole.jpeg';
import { navigate } from '../../routes/routes.js';
import { checkLoginStatus } from '../../static/app.js';

export default function Register() {
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
                            <div class="col-lg-5   d-sm-block bg-login-image mx-auto ">
                                <div class="card">
                                  <img
                                    id="bg-42-ecole"
                                    class="card-img-center mt-5"
                                    alt="Card image cap"
                                    src="${ecole}"
                                  />
                                </div>
                            </div>
                            <div class="col-lg-6 d-sm-block bg-login-image mx-auto ">
                                <div class="p-5">
                                    <div class="text-center">
                                        <h1 class="h4 text-gray-900 mb-4">Sign Up</h1>
                                    </div>
                                    <form class="user" id="register-form">
                                        <div class="form-group mb-2">
                                            <label for="username">Username</label>
                                            <input
                                                    type="username"
                                                    class="form-control form-control-user"
                                                    id="username"
                                                    placeholder="Username"
                                                    name="username"
                                                    required
                                                    autocomplete="on"
                                            >
                                        </div>
                                        <div class="form-group mb-2">
                                        <label for="first_name">First Name</label>
                                        <input
                                                type="first_name"
                                                class="form-control form-control-user"
                                                id="first_name"
                                                placeholder="First Name"
                                                name="first_name"
                                                required
                                                autocomplete="on"
                                        >
                                        </div>
                                        <div class="form-group mb-2">
                                        <label for="last_name">Last Name</label>
                                        <input
                                                type="last_name"
                                                class="form-control form-control-user"
                                                id="last_name"
                                                placeholder="Last Name"
                                                name="last_name"
                                                required
                                                autocomplete="on"
                                        >
                                        </div>

                                        
                                        <div class="form-group mb-2">
                                            <label for="email">Email</label>
                                            <input
                                                    type="email"
                                                    class="form-control form-control-user"
                                                    id="email"
                                                    placeholder="Email"
                                                    name="email"
                                                    required
                                                    autocomplete="on"
                                                    >
                                                    </div>
                                                    <div class="form-group mb-2">
                                                    <label for="password">Password</label>
                                                    <input
                                                    type="password"
                                                    class="form-control form-control-user"
                                                    id="password"
                                                    placeholder="Password"
                                                    name="password"
                                                    required
                                            >
                                        </div>
                                        <button 
                                          type="submit"
                                          class="btn btn-outline-secondary btn-user btn-block col-md-12 mt-2" 
                                          >
                                          Register
                                        </button>
                                       
                                    </form>
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

export function initRegisterEvents() {
    const registerForm =  document.querySelector('#register-form');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value; // username değerini al
        const email = document.getElementById('email').value; // Password değerini al
        const password = document.getElementById('password').value; // Password değerini al
        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        try {
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username,first_name,last_name,email, password }),
            });

            if (!response.ok) {
                console.error('Giriş başarısız.');
                const errorData = await response.json(); // Hata mesajını al
            
                // Hata mesajını kullanıcıya göster
                if(errorData.username)
                    alert(errorData.username);
                else if(errorData.mail)
                    alert(errorData.mail);
                else
                    alert(errorData.error);
            } else {
                const data = await response.json();
                console.log('Register successful:', data);
                localStorage.setItem('user', JSON.stringify(data));
                const isLogin = checkLoginStatus();
                navigate(isLogin,'/login','app'); // Kullanıcıyı dashboard'a yönlendir
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });


}