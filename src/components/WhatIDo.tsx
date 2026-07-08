import { useEffect, useRef, useState } from "react";
import "./styles/WhatIDo.css";
import { config } from "../config";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const [popupData, setPopupData] = useState<typeof config.skills.develop | null>(null);

  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };

  useEffect(() => {
    // Keep touch handling simple or rely on the onClick directly applied in the JSX
  }, []);

  return (
    <>
      <div className="whatIDO">
        <div className="what-box" style={{ width: "45vw" }}>
          <h2 className="what-title">
            <span className="gradient-text">WHAT</span>
            <span className="white-text">I</span>
            <span className="gradient-text">DO</span>
          </h2>
        </div>
        <div className="what-box">
          <div className="what-box-in">
            <div className="what-border2">
              <svg width="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="7,7"
                />
                <line
                  x1="100%"
                  y1="0"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="7,7"
                />
              </svg>
            </div>

            <div
              className="what-content"
              ref={(el) => setRef(el, 0)}
              onClick={() => setPopupData(config.skills.develop)}
              style={{ cursor: "pointer" }}
            >
              <div className="what-border1">
                <svg height="100%">
                  <line
                    x1="0"
                    y1="0"
                    x2="100%"
                    y2="0"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />
                  <line
                    x1="0"
                    y1="100%"
                    x2="100%"
                    y2="100%"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />
                </svg>
              </div>
              <div className="what-corner"></div>

              <div className="what-content-in">
                <h3>{config.skills.develop.title}</h3>
                <h4>{config.skills.develop.description}</h4>
                <p className="line-clamp-3">
                  {config.skills.develop.details}
                </p>
                <div className="what-arrow"></div>
              </div>
            </div>

            <div
              className="what-content"
              ref={(el) => setRef(el, 1)}
              onClick={() => setPopupData(config.skills.design)}
              style={{ cursor: "pointer" }}
            >
              <div className="what-border1">
                <svg height="100%">
                  <line
                    x1="0"
                    y1="100%"
                    x2="100%"
                    y2="100%"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />
                </svg>
              </div>
              <div className="what-corner"></div>
              <div className="what-content-in">
                <h3>{config.skills.design.title}</h3>
                <h4>{config.skills.design.description}</h4>
                <p className="line-clamp-3">
                  {config.skills.design.details}
                </p>
                <div className="what-arrow"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {popupData && (
        <div className="what-popup-overlay" onClick={() => setPopupData(null)}>
          <div className="what-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="what-popup-close" onClick={() => setPopupData(null)}>
              ✕
            </button>
            <h3>{popupData.title}</h3>
            <h4>{popupData.description}</h4>
            <p>{popupData.details}</p>
            <h5>Skillset & tools</h5>
            <div className="what-content-flex popup-tags">
              {popupData.tools.map((tool, index) => (
                <div key={index} className="what-tags">
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatIDo;
