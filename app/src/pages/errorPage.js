import { Skeleton } from 'three';
import dog from '../assets/dog.jpg';
import enLanguage from '../translations/en';

export default function ErrorPage() {
    const pageElement = document.createElement('div');
    let selectedLanguage = JSON.parse(localStorage.getItem('theLanguage'));
    if(!selectedLanguage)
        selectedLanguage = enLanguage;
    pageElement.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
            <div style="text-align: center;">
                <h1>${selectedLanguage.errorPage}</h1>
                <p>${selectedLanguage.loginRequired}</p>
                <img src=${dog} alt="Üzgün Köpek Resmi" style="width: 400px; height: auto;">
                <p>${selectedLanguage.error}</p>
            </div>
        </div>
    `;
    return pageElement;
}
