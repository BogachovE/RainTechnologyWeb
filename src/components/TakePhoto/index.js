import React, {Component} from 'react'

import Swiper from 'react-id-swiper';
import {TextField, SelectField, MenuItem, RaisedButton} from 'material-ui';

import {getUnicId, removeImgFromDb, formingSendObject, sendObjToFirebase} from '../../firebase/firebase'

import {NotificationManager} from 'react-notifications';

import SliderItem from './SliderItem'
import PhotoList from '../../models/photoList'
import Slider from './Slider'
const currTypeStyle = {
		maxWidth: '5rem',
		width: '4rem',
		minWidth: '3rem'
};
 var photoList = new PhotoList();


const currencyArr = [
		{
				id: 0,
				label: '₴',
				value: 'грн',
				title: 'Национальная валюта Украины — гривна',
				textToChoose: 'UAH'
		},
		{
				id: 1,
				label: '$',
				value: '$',
				title: 'Распространенная в мире валюта США',
				textToChoose: 'USD'
		},
		{
				id: 2,
				label: '€',
				value: '€',
				title: 'Валюта стран Евросоюза',
				textToChoose: 'EUR'
		},
];


class PhotoContainer extends Component {
		constructor(props) {
				super(props);

				this.state = {
						item: this.props.chosenItem || {
								count: '',
								currency: 'грн',
								description: '',
								id: '',
								partNumber: '',
								poductName: '',
								productName: '',
								price: '',
								photos: ['','','']
						},
						errors: {
								price: '',
								count: ''
						},
						system: {
								currencyId: 0,
								clearImgs: false,
								activeSlide: null,
								sliderConf: {
										pagination: '.swiper-pagination',
										paginationClickable: true,
										effect: 'coverflow',
										nextButton: '.swiper-button-next',
										prevButton: '.swiper-button-prev',
										slidesPerView: 3,
										rebuildOnUpdate: true,
										centeredSlides: true,
										initialSlide: 1,
										spaceBetween: 30,
										keyboardControl: true,
										loop: true,
										coverflow: {
												rotate: 50,
												stretch: 0,
												depth: 100,
												modifier: 1,
												slideShadows: true
										}
								}
						},
				}
		}


		sendData = () => {
			let data = this.state.item;
			if (data.count === ''
					|| data.description === ''
					|| data.price === ''
					|| data.productName === '') {
					NotificationManager.warning('All fields must be filled');
					return;
			}
			if (data.photos.filter(item => item === '').length === data.photos.length) {
				NotificationManager.warning('Add at least one photo, please');
				return;
			}
			if(data.id !== '') {
				this.updateExistingData(data);
					return;
			}

			return getUnicId()
					.then((id) =>  formingSendObject(id, data))
					.then((sendObj) => sendObjToFirebase(sendObj))
					.then((some) => this.toggleSlideImgsRemove())
					.then((something) => this.restoreItem())
					.then((some) => Promise.resolve(NotificationManager.success('Item is saved')))
					.catch(error => console.log('error in sendData: ', error))
		};

		restoreItem = () => {
				console.log('restoreItem');
			this.setState((prevState, props) => {
								return {
										item: {
												count: '',
												currency: 'грн',
												description: '',
												id: '',
												partNumber: '',
												poductName: '',
												productName: '',
												price: '',
												photos: ['', '', '']
										},
										errors: {
												price: '',
												count: ''
										},
										system: {
												currencyId: 0,
												clearImgs: false,
												sliderConf: {
														initialSlide: 1
												}
										}
								}
						});
			return Promise.resolve();
		};

		//Обновляем существующий объект данных
		updateExistingData = (data) => {
				let {removeChosenItem} = this.props;
				return sendObjToFirebase(data)
						.then((some) => this.toggleSlideImgsRemove())
						.then((something) => this.restoreItem())
						.then(() => removeChosenItem())
						.catch(error => console.log('error when sending: ', error));
		};


		//FROM SLIDER

		addImg = (url) => {
                photoList.addPhoto(url);

				let newItems = [...this.state.item];
				newItems.push(url);
				this.setState((prevState, props) => {
						return {items: newItems}
				});
				this.setActiveSlide();
				this.addGallItem();
		};

		removeImg = (imgIdx) => {
				let newPhotos = [...this.state.item.photos];
				newPhotos[imgIdx] = '';
			let newItem = Object.assign( {}, this.state.item, {
					photos: newPhotos
			});
			this.setActiveSlide();
			this.setState((prevState, props) => {
								return {item: newItem}
						});
			this.addGallItem();
		};



		addGallItem = () => {
				let emptyPhotosLen = this.state.item.photos.filter(el => el === '').length;
				// console.log('emptyPhotosLength: ', emptyPhotosLen);
				if (emptyPhotosLen === 0) {
						let newPhotosArr = this.state.item.photos.concat('');
						let newItem = Object.assign({}, this.state.item, {
								photos: newPhotosArr
						});

						// console.log('newItem in if: ', newItem);
						this.setState((prevState, props) => {
								return {
										item: newItem
								}
						});
				} else if (emptyPhotosLen > 2) {
						let newPhotosArr = this.state.item.photos.concat();
						// console.log('newPhotosArr: ', newPhotosArr);
						let emptyItemIdx = newPhotosArr.lastIndexOf('');
						// console.log('emptyItemIdx: ', emptyItemIdx);
						newPhotosArr.splice(emptyItemIdx);
						// console.log('newPhotosArr after splice: ', newPhotosArr);
						let newItem = Object.assign({}, this.state.item, {
								photos: newPhotosArr
						});
						this.setState((prevState, props) => {
											return {item: newItem}
									});
				}
		};



		//Добавляем УРЛ картинки в объект и добавляем пустой слайд, если все слайды с УРЛами
		setPic = (url, i) => {
			photoList.addPhoto2(url, i);
				let newPicsArr = [...this.state.item.photos];
				newPicsArr[i] = url;
				let itemWithNewPic = Object.assign({}, this.state.item, {
						photos: newPicsArr
				});

				this.setState((prevState, props) => {
						return {item: itemWithNewPic}
				});
				this.setActiveSlide();
				this.addGallItem();
		};
		

		toggleSlideImgsRemove = () => {
				let newSystem = Object.assign( {}, this.state.system, {
						clearImgs: true
				});
				this.setState((prevState, props) => {
									return {
											system: newSystem
									}
							});
				return Promise.resolve();
		};

		//END SLIDER

		//FORM

		makeCurrencySelectItems = () => {
				return currencyArr.map(item => {
						let {textToChoose, title, id, label} = item;
						return <MenuItem key={id} value={id} primaryText={textToChoose} title={title} label={label}/>
				})
		};


		handleChangeCurr = (event, index, value) => {
				let newItemCurrency = currencyArr[index].value;
				let newItem = Object.assign({}, this.state.item, {
						currency: newItemCurrency
				});
				let newSystem = Object.assign({}, this.state.system, {
						currencyId: value
				});

				this.setState((prevState, props) => {
						return {
								item: newItem,
								system: newSystem
						}
				});
		};

		setSomeValue = (event, value) => {
				let keyName = event.target.name;
				let newItem = Object.assign({}, this.state.item);
				if (keyName === 'price' || keyName === 'count') {
						if (!isFinite(value)) {
								let errors = Object.assign({}, this.state.errors);
								errors[`${keyName}`] = 'Введите число!';
								this.setState({
										errors: errors
								});
								return
						} else {
								if (this.state.errors[`${keyName}`]) {
										this.setState({
												errors: {
														...this.state.errors,
														[`${keyName}`]: ''
												}
										})
								}
						}
				}
				if (keyName === 'productName') {
						newItem[`${keyName}`] = value;
						newItem['poductName'] = value;
				} else {
						newItem[`${keyName}`] = value;
				}
				this.setState({
						item: newItem
				});
		};


		setActiveSlide = () => {
				let newSliderConf = Object.assign({}, this.state.system.sliderConf);
			let actSlide = document.querySelector('.swiper-slide-active').attributes[1].nodeValue || 0;
		// 	console.log('swiperSlideIndex: ', actSlide);
			actSlide = parseInt(actSlide) || 0;
			newSliderConf.initialSlide = actSlide;
			this.setState((prevState, props) => {
								return {
										system: {
										...this.state.system,
										sliderConf: newSliderConf
								}}
						});
		};


		render = () => {

				return (

						<div className="photo container">

								<Slider
										clearImgs={this.state.system.clearImgs}
										initialSlide={this.state.system.sliderConf.initialSlide}
										removeImg={this.removeImg}
										setPic={this.setPic}
										addImg={this.addImg}
										photos={this.state.item.photos} />


								<div className="form">
										<div className="main">
												<TextField
														name='productName'
														className="form-input"
														floatingLabelText="Name"
														value={this.state.item.productName}
														onChange={(e, val) => this.setSomeValue(e, val)}
												/>

												<TextField
														name='description'
														className="form-input"
														floatingLabelText="Description"
														value={this.state.item.description}
														onChange={(e, val) => this.setSomeValue(e, val)}
												/>
												<div className="price">

														<TextField name='price'
														           className="form-input"
														           floatingLabelText="Price"
														           errorText={this.state.errors.price}
														           value={this.state.item.price}
														           onChange={(e, val) => this.setSomeValue(e, val)}
														/>

														<SelectField
																name="currencyId"
																style={currTypeStyle}
																onChange={this.handleChangeCurr}
																value={this.state.system.currencyId}
														>
																{this.makeCurrencySelectItems()}
														</SelectField>
												</div>

												<TextField
														name='count'
														className="form-input"
														floatingLabelText="Count"
														value={this.state.item.count}
														errorText={this.state.errors.count}
														onChange={(e, val) => this.setSomeValue(e, val)}
												/>

										</div>
										<div className="footer">
												<RaisedButton onTouchTap={this.sendData}>Save</RaisedButton>
										</div>
								</div>

						</div>
				);
		}
}




export default PhotoContainer;