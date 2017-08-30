import * as firebase from 'firebase'
import keys from './keys'

let database;

export const fireInit = () => {
		firebase.initializeApp(keys);
		database = firebase.database();
};

//ДОСТАЕМ ДАННЫЕ ИЗ БАЗЫ ДАННЫХ
export const getFireDataOnce = (path) => {
		return firebase.database().ref().child(`${path}`)
				.once('value')
				.then((snapshot) => snapshot.val())
				.then(result => result)
				.catch(error => console.log('error in getFireDataOnce: ', error));
};

export const formingPostData = (id, object) => {
		let currObj = {
				'0': 'грн',
				'1': '$',
				'2': '€'
		};
		let postData = {};
		Object.keys(object).forEach(key => {
				if (key === 'currencyId') {
						postData[`currency`] = currObj[`${object[key]}`];
				} else if (key === 'errors') {
				} else if (key === 'name') {
						postData['productName'] = object[`${key}`];
						postData['poductName'] = object[`${key}`];
				} else {
						postData[`${key}`] = object[`${key}`];
				}
		});
		postData['id'] = id;
		postData['partNumber'] = id;

		let picsArray = object['photos'];

		return {
				id: id,
				postData: postData,
				photoLinks: picsArray
		}
};

export const formingSendObject = (id, data) => {
	if(!data['id']) data['id'] = id;
	if(!data['partNumber']) data['partNumber'] = id;
	data.photos = data.photos.filter(el => el !== '');
	return data
};

export const sendObjToFirebase = (obj) => {
		let {id, photos} = obj;
		let updates = {};
		updates[`/columns/${id}`] = obj;
		updates[`/columnsCount`] = id;
		updates[`/photoLinks/${id}`] = photos;
		return firebase.database().ref().update(updates)
};

export const getUnicId = () => {
		return getFireDataOnce('columnsCount')
				.then(result => result + 1)
				.catch(error => console.log(error));
};

export const updateFireDb = (obj) => {
		let {id, postData, photoLinks} = obj;
		let updates = {};
		updates[`/columns/${id}`] = postData;
		updates[`/columnsCount`] = id;
		updates[`/photoLinks/${id}`] = photoLinks;
		return firebase.database().ref().update(updates)
};

/*ЗАГРУЖАЕМ ФАЙЛЫ*/

export const loadFile = (file) => {
		let storageRef = firebase.storage().ref(),
				imgRef = null,
				id;

		return getUnicId()
				.then(res => {
						id = res;
						imgRef = storageRef.child(`images/${id}/${file.name}`);
						return res;
				})
				.then(() => imgRef.put(file))
				.then(snap => snap.downloadURL)
				.then(result => Promise.resolve(result))
				.catch(error => console.log('error in loadFile: ', error));

		// return getUnicId()
		// 		.then(res => handleUpload(res, file))
		// 		.then(result => Promise.resolve(result))
		// 		.catch(error => console.log('error in loadFile: ', error));
};

// export const handleUpload = (res, file) => {
//
// 		let imgRef = firebase.storage().ref().child(`images/${res}/${file.name}`).put(file);
// 		let result = null;
//
// 		imgRef.on('state_changed', (snap)=> {
// 			let progress = (snap.bytesTransferred / snap.totalBytes) * 100;
// 			console.log('Upload is ' + progress + '% done');
// 			switch (snap.state) {
// 					case firebase.storage.TaskState.PAUSED: // or 'paused'
// 							console.log('Upload is paused');
// 							break;
// 					case firebase.storage.TaskState.RUNNING: // or 'running'
// 							console.log('Upload is running');
// 							break;
// 			}
// 	}, function(error) {
// 			// Handle unsuccessful uploads
// 			console.log('error while sending file: ', error);
// 	}, function() {
// 			// Handle successful uploads on complete
// 			// For instance, get the download URL: https://firebasestorage.googleapis.com/...
// 			let downloadURL = imgRef.snapshot.downloadURL;
// 			result = downloadURL;
// 			console.log('downURL: ', downloadURL);
// 	});
// 	console.log('res in the end: ', result);
// 	return result
// };


export const sendMailObjToDb = (mail) => {
		let dbRef = firebase.database().ref();
		return dbRef.child('/mailObj').set(mail)
};


export const removeImgFromDb = (id, idx) => {
		console.log('id: ', id);
		console.log('idx: ', idx);
		let dbRef = firebase.database().ref();
		return dbRef.child(`photoLinks/${id}/${idx}`).remove();
		// return dbRef.child(`photoLinks/${id}/${idx}`).set(null);
};


export const getFile = (id, name) => {
	let storageRef = firebase.storage().ref();
	return storageRef.child(`images/${id}/${name}`).getDownloadURL()
			.then(res => Promise.resolve(res))
			.catch(error => console.log('error in getFile: ', error))
};

export const removeSelectedData = (arr) => {
		let databaseRef = firebase.database().ref();
		let updates = {};
		arr.forEach(e => {
				updates[`/columns/${e}`] = null;
		});
		return databaseRef.update(updates)
};

export const changeSomeValInSomeObj = (index, name, value) => {
		let databaseRef = firebase.database().ref();
		return databaseRef.child(`/columns/${index}/${name}`).set(value)
};









