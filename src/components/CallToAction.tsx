import { config } from "../config";
import "./styles/CallToAction.css";

const CallToAction = () => {
  return (
    <div className="cta-section">
      <div className="cta-buttons">
        <a 
          href="https://movies-zg7v.onrender.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="cta-btn cta-btn-play"
          data-cursor="disable"
        >
          Review some movies →
        </a>
        
        <a 
          href={config.contact.linkedin} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="cta-btn cta-btn-hire"
          data-cursor="disable"
        >
          Let's Connect →
        </a>
      </div>
    </div>
  );
};

export default CallToAction;
