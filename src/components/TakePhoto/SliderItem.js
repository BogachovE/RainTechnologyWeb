import React from 'react';
import {loadFile} from '../../firebase/firebase'

import IconButton from 'material-ui/IconButton';
import ActionDel from 'material-ui/svg-icons/action/delete';


class SliderItem extends React.Component {
		constructor(props) {
				super(props);

				this.state = {
						imgURL: this.props.imgURL || ''
				};
		}

		handleSubmit = (file) => {
				loadFile(file)
						.then(result => {
								this.setState(() => {
													return {imgURL: result}
											});
								 this.props.addImg(result);
								return result
						})
						.then(res => this.props.setPic(res, this.props.index))
						.catch(error => console.log(error));

		};

		shouldComponentUpdate(nextProps, nextState) {
				if (this.state.imgURL !== nextProps.imgURL || this.state.imgURL !== nextState.imgURL || nextProps.clearImgs === true) return true;
				return false
		}

		componentWillReceiveProps(nextProps, nextState) {
				if (nextProps.clearImgs) this.clearState();
				if (nextProps.imgURL || nextProps.imgURL === '') {
						this.setState((prevState, props) => {
								return {imgURL: nextProps.imgURL}
						});
				}
		}

		clearState = () => {
				this.setState({imgURL: ''});
		};
		
		removeImg = () => {
				this.props.removeImg(this.props.index);
		// 	this.setState((prevState, props) => {
		// 						return {imgURL: ''}
		// 				});
		};

		// seeWhatWeHave = (e) => {
		// 	console.log('lets see: ', e.target);
		// };



		render = () => {

				return (
						<div className={`${this.props.className}`}>
								{this.state.imgURL
										? <div className="img-container">
												<div className="remove-img">
														<IconButton tooltip={'remove Image'} onTouchTap={this.removeImg} onClick={() => console.log('clicked')}>
																<ActionDel />
														</IconButton>
												</div>
												<img src={`${this.state.imgURL}`} style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
											</div>
										: <label className="setFile" onChange={(e) => this.handleSubmit(e.target.files[0])}>
										<input type="file" onChange={(e) => console.log('onChange e input: ', e)}/>
								</label>
								}
						</div>
				);
		}
}

export default SliderItem




//(e) => console.log('onChange event label: ', e)
//onChange={(e) => this.handleSubmit(e.target.files[0])}