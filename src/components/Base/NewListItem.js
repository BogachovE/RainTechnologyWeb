import React, {Component} from 'react'

import {Checkbox} from 'material-ui'

import SmallSlider from './SmallSlider'
import RowCell from './ListRowCell'


class Item extends Component {
		constructor(props) {
				super(props);

				this.state = {
						checked: false
				}
		}


		componentWillReceiveProps(nextProps, nextState) {
			if(!this.props.checkedAll && nextProps.checkedAll && this.state.checked === false) {
				this.checkItem()
			} else if (!this.props.uncheckedAll && nextProps.uncheckedAll && this.state.checked === true) {
					this.uncheckItem();
			}
		};

		shouldComponentUpdate(nextProps, nextState) {
				if (nextProps.checkedAll === true && this.state.checked === false) return true;
				if(nextProps.uncheckedAll === true && this.state.checked === true) return true;
				if(nextState.checked !== this.state.checked) return true;
				if(this.state.checked === true && nextProps.checkedAll === true && nextState.checked === false) return true;
				return false;
		};

		checkItem = () => {
			this.setState((prevState, props) => {
								return {checked: true}
						});
		};

		uncheckItem = () => {
				this.setState((prevState, props) => {
									return {checked: false}
							});
		};

		toggleCheck = () => {
			this.setState((prevState, props) => {
								return {checked: !prevState.checked}
						}, this.props.setCheckedItemId(this.props.item.id));
		};

		makeRowClass = () => {
			return	this.state.checked ? 'adminka-row active' : 'adminka-row'
		};

		changeSomeVal = (name, val) => {

		};

		render = () => {

				let {item, remIndex} = this.props;
				let {checked} = this.state;
				//debugger;
				return (
						<tr className={this.makeRowClass()}>
								<td className="adminka-cell checkbox">
										<Checkbox onCheck={this.toggleCheck} checked={checked} iconStyle={{marginRight: '0'}}/>
								</td>
								<RowCell name={'productName'} index={item.id} value={item.productName} checked={checked} remIndex={remIndex}/>
								 <td className="adminka-cell partNumber">
								 		{item.partNumber}
								 </td>
								<RowCell name={'description'} index={item.id} value={item.description} checked={checked} remIndex={remIndex}/>
								<RowCell name={'count'} index={item.id} value={item.count} checked={checked} remIndex={remIndex}/>
								<td className="adminka-cell slider">
										<SmallSlider photos={item.photos} checked={this.state.checked} setChosenItem={() => this.props.setChosenItem(item)}/>
								</td>

						</tr>

				)
		}

}


export default Item
