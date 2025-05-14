import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button'; // Replace with your button component

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <Button onClick={toggleLanguage}>
      {i18n.language === 'ar' ? 'En' : 'Ar'}
    </Button>
  );
}
