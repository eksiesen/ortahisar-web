import React, { useEffect } from 'react';

export const WebViewComponent = React.forwardRef<HTMLIFrameElement, {
  html: string;
  style?: any;
  onMessage?: (event: any) => void;
}>((props, ref) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only process string data to avoid Webpack HMR or other tool messages
      if (typeof event.data !== 'string') return;
      
      if (props.onMessage) {
        props.onMessage({
          nativeEvent: {
            data: event.data
          }
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [props.onMessage]);

  return (
    <iframe
      ref={ref}
      srcDoc={props.html}
      style={{ width: '100%', height: '100%', borderWidth: 0, ...props.style }}
      title="Trabzon Ortahisar Canlı Harita"
    />
  );
});

export default WebViewComponent;
