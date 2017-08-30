import React, {Component} from 'react'

import {TextField} from 'material-ui'

import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/image/edit'
import OkIcon from 'material-ui/svg-icons/navigation/check'

import {changeSomeValInSomeObj} from '../../firebase/firebase'

const styles = {
		count: {
				width: '4rem',
		},
};

class RowCell extends Component {
		constructor(props) {
				super(props);

				this.state = {
						name: props.name,
						value: props.value,
						changeVal: false,
						cellWidth: null,
				};

				setTimeout(this.getWidth, 2000);
		}

		componentWillReceiveProps(nextProps, nextState) {
				if(!nextProps.checked && this.state.changeVal) {
						this.setState((prevState, props) => {
								return {
										changeVal: false,
										value: nextProps.value
								}
						});
				}

		};

		handleChange = (e) => {
				let {value} = e.target;
				this.setState((prevState, props) => {
						return {value: value}
				});
		};

		toggleEditing = () => {
				this.setState((prevState, props) => {
						return {changeVal: !prevState.changeVal}
				});
		};

		getWidth = () => {
				let width = document.querySelector(`.cell.${this.state.name}.static`).offsetWidth;
				this.setState((prevState, props) => {
						return {cellWidth: width}
				});
		};

		changeValInDb = () => {
				let {name, value} = this.state;
				changeSomeValInSomeObj(this.props.index, name, value)
						.then(this.setState((prevState, props) => {
								return {changeVal: !prevState.changeVal}
						}))
		};

		setTextStyle = () => {
				if(this.state.name === 'count') {
						return styles.count;
				}
		};

		setStyle = () => {
				return this.state.changeVal ? {width: `${this.state.cellWidth + 15}px`} : null
		};

		render = () => {
				return (
						<td className={`adminka-cell ${this.state.name}`} style={this.setStyle()}>
								{ this.state.changeVal
										? <div className={`cell ${this.state.name} change`}>
												<TextField
														style={this.setTextStyle()}
														name={`${this.props.index}-${this.state.name}`}
														value={this.state.value}
														fullWidth={true}
														onChange={this.handleChange}/>
												<IconButton onTouchTap={this.changeValInDb} tooltip={`set new value`}>
														<OkIcon/>
												</IconButton>
										</div>
										: <div className={`cell ${this.state.name} static`}>
												<p>{this.state.value}</p>
												{this.props.checked
												&&  <IconButton onTouchTap={this.toggleEditing} tooltip={`change ${this.state.name}`}>
														<EditIcon/>
												</IconButton>
												}
										</div>
								}
						</td>
				)
		}
}

export default RowCell