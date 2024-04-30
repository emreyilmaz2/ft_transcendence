import trLanguage from './tr.js';
import enLanguage from './en.js';

let currentLanguage = 'TR';
let isInitialLoad = true;

document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        setLanguage(savedLanguage);
    }
});

const translations = {
    TR: trLanguage,
    EN: enLanguage
};

export const setLanguage = (lang) => {
    currentLanguage = lang;
    localStorage.setItem('language', lang);

    if (!isInitialLoad) {
        location.reload();
    } else {
        isInitialLoad = false;
    }

};

export const translate = (key) => {
    const translationObject = translations[currentLanguage];
    return translationObject[key] || key;
};
