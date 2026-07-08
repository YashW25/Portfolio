import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import './styles/CookieConsent.css';

const CookieConsentBanner = () => {
  const { hasConsented, setConsent } = useAppStore();
  const [showPreferences, setShowPreferences] = useState(false);
  
  const [prefs, setPrefs] = useState({
    analytics: false,
    performance: false,
    marketing: false,
  });

  if (hasConsented) return null;

  const handleAcceptAll = () => {
    setConsent({ analytics: true, performance: true, marketing: true });
    // Also trigger backend call here ideally
  };

  const handleRejectAll = () => {
    setConsent({ analytics: false, performance: false, marketing: false });
  };

  const handleSavePreferences = () => {
    setConsent(prefs);
  };

  return (
    <AnimatePresence>
      {!hasConsented && (
        <motion.div 
          className="cookie-banner-wrapper"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
        >
          <div className="cookie-banner">
            {!showPreferences ? (
              <>
                <div className="cookie-content">
                  <h3>We value your privacy</h3>
                  <p>We use essential cookies to make our site work. With your consent, we may also use non-essential cookies to improve user experience and analyze website traffic.</p>
                </div>
                <div className="cookie-actions">
                  <button className="btn-manage" onClick={() => setShowPreferences(true)}>Manage Preferences</button>
                  <button className="btn-reject" onClick={handleRejectAll}>Reject All</button>
                  <button className="btn-accept" onClick={handleAcceptAll}>Accept All</button>
                </div>
              </>
            ) : (
              <div className="cookie-preferences">
                <h3>Cookie Preferences</h3>
                <div className="preference-item">
                  <div>
                    <h4>Essential (Strictly Necessary)</h4>
                    <p>Required for the website to function.</p>
                  </div>
                  <input type="checkbox" checked disabled />
                </div>
                <div className="preference-item">
                  <div>
                    <h4>Analytics</h4>
                    <p>Helps us understand how visitors interact with the website.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={prefs.analytics}
                    onChange={(e) => setPrefs(prev => ({ ...prev, analytics: e.target.checked }))}
                  />
                </div>
                <div className="cookie-actions">
                  <button className="btn-manage" onClick={() => setShowPreferences(false)}>Back</button>
                  <button className="btn-accept" onClick={handleSavePreferences}>Save Preferences</button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;
