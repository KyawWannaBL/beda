import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.britium.express', // This is what was missing
  appName: 'Britium Express',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;