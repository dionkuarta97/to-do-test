import Modal from 'react-native-modal';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import {useCreateTodoMutation} from '../utils/redux/RTKQuery';
import ModalLoading from './ModalLoading';

import PushNotification from 'react-native-push-notification';

const BottomSheetForm = ({show, onClose = () => {}}) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [createData, {isLoading}] = useCreateTodoMutation();

  const handleNotifications = () => {
    PushNotification.localNotificationSchedule({
      channelId: 'test-channel',
      title: 'TO DO',
      message: title,
      date: new Date(date.setMinutes(date.getMinutes() - 5)),
      allowWhileIdle: true,
    });
  };

  const addToCalender = () => {
    return new Promise((resolved, rejected) => {
      AddCalendarEvent.presentEventCreatingDialog({
        title: title,
        startDate: date.toISOString(),
        endDate: date.toISOString(),
      })
        .then(eventInfo => {
          // resolved('saved');
          if (eventInfo.action === 'CANCELED') {
            rejected('cancel');
          } else {
            resolved('save');
          }
          console.log(eventInfo);
        })
        .catch(error => {
          rejected('cancel');
        });
    });
  };
  return (
    <>
      <Modal
        onBackdropPress={onClose}
        style={style.modal}
        animationIn={'slideInUp'}
        animationInTiming={300}
        animationOutTiming={400}
        isVisible={show}>
        <View style={style.container}>
          <Pressable
            onPress={onClose}
            style={({pressed}) => [
              style.buttonClose,
              {
                transform: [{scale: pressed ? 0.98 : 1}],
                opacity: 0.7,
              },
            ]}>
            <Text style={style.textClose}>X</Text>
          </Pressable>
          <Text style={style.header}>Add A Task</Text>
          <View style={style.line} />

          <ScrollView style={style.body}>
            <Text>Title</Text>
            <TextInput
              onChangeText={text => setTitle(text)}
              value={title}
              multiline={true}
              style={style.input}
            />
            <Text>Date</Text>
            <TouchableOpacity
              style={{marginBottom: 50}}
              activeOpacity={0.8}
              onPress={() => setOpen(true)}>
              <View pointerEvents="none">
                <TextInput
                  value={date.toDateString() + ' ' + date.toLocaleTimeString()}
                  style={style.input}
                />
              </View>
            </TouchableOpacity>

            <DatePicker
              modal
              is24hourSource="device"
              open={open}
              date={date}
              onConfirm={date => {
                setOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </ScrollView>
          <Pressable
            disabled={title === '' ? true : false}
            onPress={() => {
              let data = {
                title,
                date,
              };

              Alert.alert('Information', 'save to your calendar?', [
                {
                  text: 'yes',
                  onPress: () => {
                    addToCalender().then(() => {
                      createData(data);
                      onClose();
                      setTitle('');
                      setDate(new Date());
                      handleNotifications();
                    });
                  },
                },
                {
                  text: 'no',
                  onPress: () => {
                    createData(data);
                    onClose();
                    setTitle('');
                    setDate(new Date());
                    handleNotifications();
                  },
                },
              ]);
              // createData(data);
            }}
            style={pressed => [
              style.buttonSave,
              {
                opacity: pressed ? 0.7 : 1,
                transform: [
                  {
                    scale: pressed ? 0.98 : 1,
                  },
                ],
                backgroundColor: title === '' ? 'gray' : 'green',
              },
            ]}>
            <Text style={{color: 'white'}}>Save</Text>
          </Pressable>
        </View>
      </Modal>
      <ModalLoading show={isLoading} />
    </>
  );
};

export default BottomSheetForm;

const style = StyleSheet.create({
  modal: {margin: 0, justifyContent: 'flex-end'},
  container: {
    paddingTop: 25,
    height: Dimensions.get('screen').height / 2,
    backgroundColor: 'white',
    position: 'relative',
    bottom: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  line: {
    borderBottomWidth: 1,
  },
  buttonSave: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginVertical: 15,
    alignSelf: 'center',
    backgroundColor: 'green',
  },
  input: {
    marginTop: 4,
    borderRadius: 10,
    width: '100%',
    minHeight: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  body: {
    padding: 15,
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonClose: {
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    width: 30,
    height: 30,
    borderRadius: 150,
    borderWidth: 1,
  },
  textClose: {
    color: 'black',
    fontSize: 15,
  },
});
