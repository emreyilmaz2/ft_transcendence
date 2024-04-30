import { navigate } from '../routes/routes';
import { changeLanguage } from './dashboard';

export default function ProfileSetting() {
    const pageElement = document.createElement('div');

    pageElement.innerHTML = `
    <h3 id="profileSettings" class="p-4 text-custom-light">Profile Setting</h3>
    <div class="col">
        <div class="container">
            <h4 id="updateProfileInfo" class="text-center mb-4 text-white">Profil Bilgilerini Güncelle</h4>
            <div class="text-center mb-4">
                <img id="profilePicture" src="" alt="Profil Fotoğrafı" style="width: 200px; height: 200px; border-radius: 50%;">
                <br>
                <input type="file" id="avatar" name="file" accept="image/png, image/jpeg">
            </div>
            <form class="user" id="update-form" enctype="multipart/form-data">
                <div class="form-group mt-2">
                    <input type="text" class="form-control" id="username" placeholder="Enter Username" autocomplete="on">
                </div>
                <div class="form-group  mt-2">
                    <input type="text" class="form-control" id="first_name" placeholder="Enter First Name" autocomplete="on">
                </div>
                <div class="form-group  mt-2">
                    <input type="text" class="form-control" id="last_name" placeholder="Enter Lastname" autocomplete="on">
                </div>
                <div class="form-group mt-2">
                    <input type="email" class="form-control" id="email" placeholder="Enter Email" autocomplete="on">
                </div>
                <div class="form-group mt-2">
                    <input type="password" class="form-control" id="password" placeholder="Enter New Password" autocomplete="off">
                </div>
                <div class="form-group mt-2">
                    <input type="password" class="form-control" id="password2" placeholder="Confirm New Password" autocomplete="off">
                </div>
                <div class="form-group mt-2 mb-2">
                    <input type="password" class="form-control" id="old_password" placeholder="Enter Old Password" autocomplete="off">
                </div>
                <button id="update" type="submit" class="update-btn btn btn-primary btn-block">Güncelle</button>
            </form>
        </div>
    </div>

    <div id="page-title" class="px-2"></div>
    <div id="page-main" class="mx-2"></div>
  `;

    return pageElement;
}
document.addEventListener('languageChange', (e) => {
    const t1 = document.getElementById('profileSettings');
    if(t1) t1.textContent = e.detail.lang.profileSetting;
    const t2 = document.getElementById('updateProfileInfo');
    if(t2) t2.textContent = e.detail.lang.updateProfileInfo;
    const t3 = document.getElementById('username');
    if(t3) t3.placeholder = e.detail.lang.enterUsername;
    const t4 = document.getElementById('first_name');
    if(t4) t4.placeholder = e.detail.lang.enterFirstName;
    const t5 = document.getElementById('last_name');
    if(t5) t5.placeholder = e.detail.lang.enterLastName;
    const t6 = document.getElementById('email');
    if(t6) t6.placeholder = e.detail.lang.enterEmail;
    const t7 = document.getElementById('password');
    if(t7) t7.placeholder = e.detail.lang.enterNewPassword;
    const t8 = document.getElementById('password2');
    if(t8) t8.placeholder = e.detail.lang.confirmNewPassword;
    const t9 = document.getElementById('old_password');
    if(t9) t9.placeholder = e.detail.lang.enterOldPassword;
    const t10 = document.getElementById('update');
    if(t10) t10.innerText = e.detail.lang.update;
});

export async function initProfileSettingEvents() {
    const selectedLanguage = JSON.parse(localStorage.getItem('theLanguage'));
    changeLanguage(selectedLanguage);
    try {
        const profileResponse = await fetch('http://localhost:8000/api/profile/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (!profileResponse.ok) {
            throw new Error('Profil bilgileri yüklenemedi.');
        }
        const profileData = await profileResponse.json();
        document.getElementById('username').value = profileData.username || '';
        document.getElementById('first_name').value = profileData.first_name || '';
        document.getElementById('last_name').value = profileData.last_name || '';
        document.getElementById('email').value = profileData.email || '';
        
        // Profil resmini ayarlama
        let imageUrl;
        if (profileData.normal_avatar)
            //imageUrl = `http://localhost:8000${profileData.normal_avatar}`;
            imageUrl = profileData.normal_avatar;
        else if (profileData.intra_avatar)
            imageUrl = profileData.intra_avatar;
        document.getElementById('profilePicture').src = imageUrl ;
    } catch (error) {
        console.error('An error occurred while fetching profile:', error);
    }

    const updateForm = document.getElementById('update-form');

    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // FormData nesnesini oluştur
        let password;
        const formData = new FormData();
        const old_password = document.getElementById('old_password').value;
        const new_password = document.getElementById('password').value;
        if (new_password !== ''){
            password = new_password;
        }
        else if (new_password == '' && old_password !== ''){
            password = old_password;
        }
        formData.append('first_name', document.getElementById('first_name').value);
        formData.append('last_name', document.getElementById('last_name').value);
        formData.append('username', document.getElementById('username').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('password', document.getElementById('password').value);
        formData.append('password2', document.getElementById('password2').value);
        formData.append('old_password', document.getElementById('old_password').value);
        // Profil resmini ayarlama
        const profilePhoto = document.getElementById('avatar').files[0];
        if (profilePhoto) {
            formData.append('avatar', profilePhoto);
            console.log('avatar', profilePhoto);
        }
        try {
            const response = await fetch('http://localhost:8000/api/profile/', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: formData, 
            });
            if (!response.ok) {
                console.error('Güncelleme başarısız.');
                const errorData = await response.json();
                if(errorData && errorData.old_password)
                    alert(errorData.old_password);
                else if(errorData && errorData.password)
                    alert(errorData.password);
                else if(errorData && errorData.email)
                    alert(errorData.email);
                console.log(errorData);
            }
            else {
                const updatedUser = await response.json();
                const username = updatedUser.username;
                console.log('Profile updated successfully', updatedUser);
                console.log('username : ', username);
                console.log('sifre : ', password);
                try {
                    const responseee = await fetch('http://localhost:8000/api/login/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, password }),
                    });
                    if (!responseee.ok) {
                        console.error('Giriş başarısız.');
                        const errorData = await responseee.json(); // Hata mesajını al
                        console.log(errorData);
                    } else {
                        const data = await responseee.json();
                        console.log('Login successfull:)', data);
                        localStorage.setItem('accessToken', data.access); // Erişim token'ını kaydet
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
                localStorage.setItem('PlayerName', updatedUser.username);//oyunda kullanıcı isimlerini çekebilmek için

                const profileName = `${updatedUser.first_name} ${updatedUser.last_name}`;
                document.getElementById('dashboardName').textContent = profileName;

                // Guncellenen profil fotografini degistirme ve dashboard a bildirme
                let imageUrl;
                if (updatedUser.normal_avatar)
                    //imageUrl = `http://localhost:8000${updatedUser.normal_avatar}`;
                    imageUrl = updatedUser.normal_avatar;
                else if (updatedUser.intra_avatar)
                    imageUrl = updatedUser.intra_avatar;
                document.getElementById('profilePicture').src = imageUrl;

                const profileUpdatedEvent = new CustomEvent('profileUpdated', { detail: { imageUrl } });
                document.dispatchEvent(profileUpdatedEvent);
                navigate(true, '/profile', 'page-main');
            }
        } catch (error) {
            console.error('An error occurred while updating profile');
        }
    });

}

