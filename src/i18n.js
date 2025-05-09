// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
    en: {
        translation: {
            welcome: 'Welcome to my app',
            description: 'This is a sample description.',
            items: {
                zero: 'No items',
                one: 'One item',
                other: '{{count}} items',
            },
        },
    },
    ar: {
        translation: {
            welcome: 'مرحبًا بك في تطبيقي',
            description: 'هذا وصف عينة.',
            items: {
                zero: 'لا توجد عناصر',
                one: 'عنصر واحد',
                two: 'عنصران',
                few: '{{count}} عناصر',
                many: '{{count}} عنصرًا',
                other: '{{count}} عنصر',
            },
        },
    },
};

i18n
    .use(LanguageDetector) // Detect user language
    .use(initReactI18next) // Bind i18next to React
    .init({
        resources,
        fallbackLng: 'en', // Default language
        supportedLngs: ['en', 'ar'], // Supported languages
        interpolation: {
            escapeValue: false, // React escapes by default
        },
        detection: {
            order: ['navigator', 'htmlTag', 'path', 'subdomain'], // Language detection order
        },
    });

export default i18n;