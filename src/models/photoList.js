
class PhotoList {
        constructor() {
            this.photoArray = ['','',''];
            this.getPhotoList = function () {
                return this.photoArray
            };
            this.addPhoto = function (newPhoto) {
                    let added = false;
                function iter (item, i, photoArray) {
                    if (item === '' && added === false){
                            photoArray[i] = newPhoto;
                        added = true;
                    }
                }
                this.photoArray.forEach(iter);
                if (added === false){
                    this.photoArray[this.photoArray.length] = ''
                }
                if (this.photoArray[this.photoArray.length - 1] !== ''){
                    this.photoArray[this.photoArray.length] = '';
                }
            };
            this.addPhoto2 = function (newPhoto,i) {
                this.photoArray[i] = newPhoto
            }
        }
}

export default PhotoList;

