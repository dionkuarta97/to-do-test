import {ActivityIndicator, View} from 'react-native';
import Modal from 'react-native-modal';

const ModalLoading = ({show}) => {
  return (
    <Modal isVisible={show}>
      <View
        style={{
          height: 60,
          backgroundColor: 'white',
          paddingVertical: 30,
          borderRadius: 15,
        }}>
        <ActivityIndicator color={'yellow'} size={50} />
      </View>
    </Modal>
  );
};

export default ModalLoading;
