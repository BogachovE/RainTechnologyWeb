import React, {
		Component,
} from 'react';

import SliderItem from './SliderItem'
import Swiper from 'react-id-swiper';
import {TextField, SelectField, MenuItem, RaisedButton} from 'material-ui';

class Slider extends Component {
		constructor(props) {
				super(props);


				this.swiper = null;
				
				this.state = {
						sliderConf: {
								pagination: '.swiper-pagination',
								paginationClickable: true,
								nextButton: '.swiper-button-next',
								prevButton: '.swiper-button-prev',
								slidesPerView: 3,
								rebuildOnUpdate: true,
								centeredSlides: true,
								initialSlide: 1,
								spaceBetween: 20,
								keyboardControl: true,
								preloadImages: false,
								lazyLoading: true,
								observer: true,
								onInit: (swiper) => {
										this.swiper = swiper
								},
								onClick: (e, i, o) => {
										console.log('click: ', e, i, o);
								}
						}
				};

		}

		componentWillReceiveProps(nextProps, nextState) {
				if(nextProps.initialSlide) {
						let newSliderConf = {...this.state.sliderConf};
						newSliderConf.initialSlide = nextProps.initialSlide;
						console.log('change initSlide: ', nextProps.initialSlide);
						this.setState((prevState, props) => {
											return {sliderConf: newSliderConf}
									});
				}
		}

		shouldComponentUpdate(nextProps, nextState) {
				if(nextProps.photos.filter(el => el === '').length !== this.props.photos.filter(el => el === '').length
				|| nextProps.photos.length !== this.props.photos.length) return true;
				if(nextProps.initialSlide !== this.props.initialSlide) return true;
				if(nextProps.clearImgs !== this.props.clearImgs) return true;
				return false;
		}


		rerenderSlider = () => {
				let photos = this.props.photos;
				return photos.map((el, i) => <SliderItem imgURL={el}
				                                         index={i}
				                                         key={i}
				                                         clearImgs={this.props.clearImgs}
				                                         removeImg={this.props.removeImg}
				                                         setPic={this.props.setPic}
				                                         addImg={this.props.addImg}/>);
		};

		render = () => {
				return (
						<div className="slider">
								<Swiper {...this.state.sliderConf}>
										{this.rerenderSlider()}
								</Swiper>
						</div>
				);
		}
}

export default Slider;