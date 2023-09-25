import firestore from '@react-native-firebase/firestore';

export const addNewData = data => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('List')
      .add(data)
      .then(snapshot => {
        data.id = snapshot.id;
        snapshot.set(data);
        resolve(data);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};
export const getDataFirestore = () => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('List')
      .orderBy('date', 'desc')
      .get()
      .then(querySnapshot => {
        if (querySnapshot.docs.length === 0) {
          reject('data not found');
        } else {
          let temp = [];
          querySnapshot.docs.forEach(el => {
            let date = new Date(
              el.data().date.seconds * 1000 +
                el.data().date.nanoseconds / 1000000,
            );
            temp.push({...el.data(), date});
          });
          resolve(temp);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const updateData = data => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('List')
      .where('id', '==', data.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.update(data).then(() => {
            resolve('suskses');
          });
        });
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

export const deleteData = id => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('List')
      .where('id', '==', id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete().then(() => {
            resolve('suskses');
          });
        });
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};
