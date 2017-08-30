import React, {Component} from 'react'

import Swiper from 'react-id-swiper'
import {RaisedButton} from 'material-ui'

class SmallSlider extends Component {
		constructor(props) {
				super(props);

				this.state = {
						sliderConf: {
								containerClass: 'customized-swiper-container',
								wrapperClass: 'swiper-wrapper',
								slidesPerView: 'auto',
								rebuildOnUpdate: false,
								setWrapperSize: true,
								autoHeight: true,
								initialSlide: 1,
								autoplay: 2500,
								grabCursor: true,
								preloadImages: false,
								lazyLoading: true,
								mousewheelControl: true,
								autoplayDisableOnInteraction: true,
								spaceBetween: 0,
								loop: false,
								loopedSlides: 3,
						},
						isActive: false
				}
		}

		// makeActive = () => {
		// 		let idxArr = this.props.column.formatter._self.state.selectedIndexes;
		// 		let bool = idxArr.indexOf(this.props.rowIdx) !== -1;
		// 		this.setState((prevState, props) => {
		// 				return {isActive: !bool}
		// 		});
		// };

		// setActive = (nextProps) => {
		// 		let arrIdx = nextProps.getIndex();
		// 		console.log('arrIdx:', arrIdx);
		// 		let bool = arrIdx.indexOf(nextProps.rowIdx) !== -1;
		// 		this.setState({isActive: !bool});
		// };
		
		componentWillReceiveProps = (nextProps, nextState) => {
				if(nextProps.checked === true) {
						this.setState((prevState, props) => {
											return {isActive: true}
									});
				} else if(nextProps.checked === false && this.state.isActive === true) {
						this.setState((prevState, props) => {
											return {isActive: false}
									});
				}
		};

		shouldComponentUpdate(nextProps, nextState) {
				if (nextProps.photos.length !== this.props.photos.length) return true;
				if (nextProps.checked === true && this.state.isActive === false) return true;
				if (nextProps.checked === false && this.state.isActive === true) return true;
				return false;
		}



    // photoMap =  new Promise(function (resolve, reject) {
    // 	let cur
    //     let photos = this.props.photos;
    //     let fiter = function(curentPhoto, i, photoArray) {
    //     	cur = curentPhoto:i
    //         resolve (cur)
    //     };
    //     photos.forEach(fiter)
    //
    //
    //
    // });


		render = () => {

				let photos = this.props.photos;
				return (
						<div className="slider-cell">
								{!this.state.isActive
										? <Swiper {...this.state.sliderConf}>
                                        {photos.map((el, i) => <img className="smallImg" src={el} key={i}/>)}
											</Swiper>
										: <div className="forBtn"><RaisedButton onTouchTap={() => this.props.setChosenItem()}>Edit</RaisedButton>
								</div>
								}
						</div>
				)
		}
}
//{photos.map((el, i) => <img className="smallImg" src={el} key={i}/>)}
export default SmallSlider