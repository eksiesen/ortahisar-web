import { Platform } from 'react-native';

let leafletLoadingPromise: Promise<void> | null = null;

export const loadLeaflet = (): Promise<void> => {
  if (Platform.OS !== 'web') return Promise.resolve();
  if (typeof window === 'undefined') return Promise.resolve();
  if ((window as any).L) return Promise.resolve();

  if (leafletLoadingPromise) return leafletLoadingPromise;

  leafletLoadingPromise = new Promise<void>((resolve, reject) => {
    // 1. Inject Leaflet CSS
    const linkId = 'leaflet-css';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // 2. Inject Leaflet JS Script
    const scriptId = 'leaflet-js';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        resolve();
      };
      script.onerror = (err) => {
        leafletLoadingPromise = null;
        reject(err);
      };
      document.head.appendChild(script);
    } else {
      // If script exists but window.L is not set yet, check in a loop
      const checkL = setInterval(() => {
        if ((window as any).L) {
          clearInterval(checkL);
          resolve();
        }
      }, 50);
    }
  });

  return leafletLoadingPromise;
};

export const injectMarkerStyles = (): void => {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;

  const styleId = 'leaflet-custom-marker-styles';
  if (document.getElementById(styleId)) return;

  const styleEl = document.createElement('style');
  styleEl.id = styleId;
  styleEl.textContent = `
    .custom-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .marker-bubble {
      width: 28px;
      height: 28px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid #FFF;
      box-shadow: 0 2px 4px rgba(0,0,0,0.25);
      z-index: 2;
      transition: all 0.15s ease-in-out;
    }
    .marker-arrow {
      width: 10px;
      height: 10px;
      transform: rotate(45deg);
      margin-top: -5px;
      border-right: 1.5px solid #FFF;
      border-bottom: 1.5px solid #FFF;
      z-index: 1;
      transition: all 0.15s ease-in-out;
    }
    .pulse-circle {
      position: absolute;
      width: 44px;
      height: 44px;
      border-radius: 22px;
      border: 2px solid;
      opacity: 0.5;
      animation: leaflet-pulse 1.5s infinite;
      z-index: 0;
      pointer-events: none;
    }
    @keyframes leaflet-pulse {
      0% { transform: scale(0.8); opacity: 0.5; }
      100% { transform: scale(1.3); opacity: 0; }
    }
  `;
  document.head.appendChild(styleEl);
};
