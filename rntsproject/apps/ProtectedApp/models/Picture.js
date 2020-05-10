import firestore from '@react-native-firebase/firestore';
import * as RNFS from 'react-native-fs';


class Picture {

    static COLLECTION_IDENTIFIER = 'pic'
    static SERDE_KEYS = ['id', 'timestamp', 'blob']

    static checker(arr, target)
    {
      return target.every(v => arr.includes(v));
    }

    constructor(id, timestamp = null, blob = null, uri = null, base64 = null){
        this.id = id;
        this.timestamp = timestamp;
        this.blob = blob;

        this.uri = uri;
        this.base64 = base64;
    }

    initWithUri = async () => {
      const filepath = this.uri.split('//')[1];
      const imageBase64 = await RNFS.readFile(filepath, 'base64');
      this.base64 = `data:image/jpeg;base64,${imageBase64}`;
      this.blob = firestore.Blob.fromBase64String(imageBase64);
      this.timestamp = firestore.FieldValue.serverTimestamp(),
    }

    static async fromDoc(doc){
      let picture;

      if checker(SERDE_KEYS, Object.keys(doc)))
      {
        picture = new Picture(
          doc['id'], 
          doc['timestamp'],
          doc['blob'],
          null,
          null,
        );

        let reader = new FileReader();
        let pr = new Promise(resolve => {
          reader.onload = ev => {
            resolve(ev.target.result);
          }
          reader.readAsDataURL(file);
        })

        this.base64 = await pr;
      }
      return picture;
    }


  toDoc(){
    return {
      id: this.id,
      timestamp: this.timestamp,
      blob: this.blob,
    }
  }
  
  static async listen(objectId, observer) {
    return firestore()
        .collection(COLLECTION_IDENTIFIER)
        .doc(objectId)
        .onSnapshot(
            (snapshot) => {
                let updatedObject = await Picture.fromDoc(snapshot.data());
                observer(updatedObject)
            }
        );
  };
  
  push = () => {
    const query = firestore()
          .collection(COLLECTION_IDENTIFIER)
          .doc(this.id);
    console.log("Push picture.id: ", this.id);
    const doc = this.toDoc();
    let qPromise = query
      .update(doc)
      .then(() => {
        console.log('Picture has been successfully pushed');
      })
      .catch((error) => {
        console.log('Picture has not been pushed. Raised error: ', error);
      });
    }

}

export default Picture;