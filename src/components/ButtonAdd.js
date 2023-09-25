import {Pressable, StyleSheet, Text} from 'react-native';

const ButtonAdd = ({onPress = () => {}}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        style.button,
        {
          opacity: pressed ? 0.7 : 1,
          transform: [
            {
              scale: pressed ? 0.98 : 1,
            },
          ],
        },
      ]}>
      <Text style={style.text}>+</Text>
    </Pressable>
  );
};

export default ButtonAdd;

const style = StyleSheet.create({
  button: {
    backgroundColor: 'red',
    borderRadius: 150,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 20,
    right: 20,
    position: 'absolute',
  },
  text: {
    color: 'white',
    fontSize: 30,
  },
});
