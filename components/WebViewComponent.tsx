import React from 'react';
import { WebView } from 'react-native-webview';

export const WebViewComponent = React.forwardRef<any, {
  html: string;
  style?: any;
  onMessage?: (event: any) => void;
}>((props, ref) => {
  return (
    <WebView
      ref={ref}
      originWhitelist={['*']}
      source={{ html: props.html }}
      onMessage={props.onMessage}
      style={[{ flex: 1 }, props.style]}
      domStorageEnabled
      javaScriptEnabled
    />
  );
});

export default WebViewComponent;
