import {
  Text,
  StyleSheet,
  SafeAreaView,
  PermissionsAndroid,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import ButtonAdd from './components/ButtonAdd';
import BottomSheetForm from './components/BottomSheetForm';
import {useCallback, useEffect, useState} from 'react';
import {getFCMToken} from './utils/firebase/notication';
import PushNotification from 'react-native-push-notification';
import RNCalendarEvents from 'react-native-calendar-events';
import {useGetDataQuery} from './utils/redux/RTKQuery';
import BottomSheetUpdate from './components/BottomSheetUpdate';
import ModalLoading from './components/ModalLoading';

const App = () => {
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const {data, error, isLoading} = useGetDataQuery();
  const [detail, setDetail] = useState(null);
  const handleShow = useCallback(val => {
    setShow(val);
  });

  const getToken = async () => {
    try {
      const token = await getFCMToken();
      console.log(token);
    } catch (error) {
      console.log(error);
    }
  };

  const createChannel = () => {
    PushNotification.createChannel({
      channelId: 'test-channel',
      channelName: 'Test Channel',
    });
  };

  console.log(data);

  useEffect(() => {
    createChannel();
    RNCalendarEvents.checkPermissions().then(
      result => {
        console.log(result);
      },
      result => {
        console.error(result);
      },
    );
    getToken();
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }, []);

  return (
    <SafeAreaView style={style.container}>
      {isLoading && <ModalLoading />}
      {detail && (
        <BottomSheetUpdate
          single={data?.length === 1}
          show={showUpdate}
          data={detail}
          onClose={() => {
            setShowUpdate(false);
            setDetail(null);
          }}
        />
      )}
      <ScrollView>
        {data?.map(el => (
          <TouchableOpacity
            onPress={() => {
              setDetail(el);
              setShowUpdate(true);
            }}
            style={{
              marginVertical: 4,
              borderBottomWidth: 1,
              paddingVertical: 3,
            }}
            key={el.id}>
            <Text numberOfLines={2} style={style.text}>
              {el.title}
            </Text>
            <Text style={[style.text, {marginTop: 3}]}>
              {el.date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <BottomSheetForm
        show={show}
        onClose={() => {
          handleShow(false);
        }}
      />

      <ButtonAdd
        onPress={() => {
          handleShow(true);
        }}
      />
    </SafeAreaView>
  );
};

export default App;

const style = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  text: {
    color: 'black',
  },
});
