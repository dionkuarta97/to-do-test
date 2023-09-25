import messaging from '@react-native-firebase/messaging';

export const getFCMToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();

    const token = await messaging().getToken();
    return token;
  } catch (error) {
    throw error;
  }
};

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};
