// src/components/LanguageSwitcher.js
import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    return (
        <div className="flex space-x-2 rtl:space-x-reverse">
            <button
                onClick={() => i18n.changeLanguage('en')}
                className={`px-3 py-1 rounded ${
                    i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
            >
                English
            </button>
            <button
                onClick={() => i18n.changeLanguage('ar')}
                className={`px-3 py-1 rounded ${
                    i18n.language === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
            >
                العربية
            </button>
        </div>
    );
}

export default LanguageSwitcher;