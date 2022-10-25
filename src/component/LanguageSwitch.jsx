import React, { useCallback, useState } from 'react';

import { getLanguage, setLanguage as setStorageLanguage, LANGUAGES, t } from '../Util/translate';

const LanguageSwitch = () => {
  const [language, setLanguage] = useState(getLanguage());

  const toggleLanguage = useCallback(() => {
    if (language === LANGUAGES.cs) {
      setLanguage(LANGUAGES.en);
      setStorageLanguage(LANGUAGES.en);
      return;
    }

    setLanguage(LANGUAGES.cs);
    setStorageLanguage(LANGUAGES.cs);
  }, [language]);

  return (
    <div style={{ cursor: 'pointer' }} onClick={toggleLanguage}>
      {t(`languages.${language}`)}
    </div>
  );
};

export default LanguageSwitch;
