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
} from 'react-native';
import {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {
  toDoApi,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from '../utils/redux/RTKQuery';
import ModalLoading from './ModalLoading';

import PushNotification from 'react-native-push-notification';
import {useDispatch} from 'react-redux';

const BottomSheetUpdate = ({show, onClose = () => {}, data, single}) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(data.date);
  const [title, setTitle] = useState(data.title);
  const [updateData, {isLoading}] = useUpdateTodoMutation({
    fixedCacheKey: 'ToDo',
  });
  const [deleteData, {isLoading: loadingDelete}] = useDeleteTodoMutation({
    fixedCacheKey: 'ToDo',
  });
  const dispatch = useDispatch();
  const handleNotifications = () => {
    PushNotification.localNotificationSchedule({
      channelId: 'test-channel',
      title: 'TO DO',
      message: title,
      date: new Date(date.setMinutes(date.getMinutes() - 5)),
      allowWhileIdle: true,
    });
  };

  return (
    <>
      {data && (
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
              <Text style={style.header}>Update or Delete</Text>
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
                      value={
                        date.toDateString() + ' ' + date.toLocaleTimeString()
                      }
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
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Pressable
                  disabled={title === '' ? true : false}
                  onPress={() => {
                    let body = {
                      id: data.id,
                      title,
                      date,
                    };
                    updateData(body).finally(() => {
                      setTitle('');
                      setDate(new Date());
                      handleNotifications();

                      onClose();
                    });
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
                  <Text style={{color: 'white'}}>Update</Text>
                </Pressable>
                <Pressable
                  disabled={title === '' ? true : false}
                  onPress={() => {
                    let body = {
                      id: data.id,
                      title,
                      date,
                    };
                    deleteData(data.id).finally(() => {
                      setTitle('');
                      setDate(new Date());
                      if (single) dispatch(toDoApi.util.resetApiState());
                      onClose();
                    });
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
                      backgroundColor: title === '' ? 'gray' : 'red',
                    },
                  ]}>
                  <Text style={{color: 'white'}}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <ModalLoading show={isLoading} />
          <ModalLoading show={loadingDelete} />
        </>
      )}
    </>
  );
};

export default BottomSheetUpdate;

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
