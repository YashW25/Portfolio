import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import './styles/WelcomePopup.css';

const WelcomePopup = () => {
  const { hasConsented, welcomePopupShown, setWelcomePopupShown } = useAppStore();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup 3 seconds after consent if not shown
    if (hasConsented && !welcomePopupShown) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [hasConsented, welcomePopupShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch('http://localhost:3001/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          page: window.location.pathname,
          referrer: document.referrer,
          browser: navigator.userAgent
        })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setIsVisible(false);
      setWelcomePopupShown();
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="popup-overlay">
        <motion.div 
          className="welcome-popup"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <h2>Welcome!</h2>
          <p>Provide your contact details if you'd like us to reach out with project updates or discuss your requirements.</p>
          
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
            />
            <input 
              type="tel" 
              placeholder="Phone Number" 
              required 
              value={formData.phone}
              onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
            />
            <input 
              type="email" 
              placeholder="Email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
            />
            
            <div className="popup-actions">
              <button type="submit" className="btn-continue" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Continue'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WelcomePopup;
