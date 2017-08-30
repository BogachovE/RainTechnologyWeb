import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import {TextField, SelectField, MenuItem, RaisedButton} from 'material-ui';

import IconButtons from '../System/IconBtns'

import {removeSelectedData} from '../../firebase/firebase'

import {NotificationManager} from 'react-notifications';


import SendMail from './SendMail'

import ListTable from './NewList'


class Base extends Component {
		constructor(props) {
				super(props);

				this.state = {
						idxForRemove: [],
						sendMail: false,
						uncheckedAll: true,
                    	checkedItemsArr: []
				};
		}

		toggleMail = () => {
			this.setState((prevState, props) => {
								return {sendMail: !prevState.sendMail}
						});
		};

		toggleRemove = (idxArr) => {
		  let newArr = this.state.idxForRemove.concat();
		  idxArr.forEach(idx => {
		  	let index = newArr.indexOf(idx);
		  	if(index < 0) {
		  			newArr.push(idx)
			  } else {
		  			newArr = newArr.filter(el => el !== idx);
			  }
		  });

		  this.setState({
		      idxForRemove: newArr
		  })
		};

    renderChildrenWithProps = () => {
        return React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {
                idxForRemove: this.state.idxForRemove,
                sendMail: this.state.sendMail,
                uncheckedAll: this.uncheckedAll,
                checkedItemsArr: this.checkedItemsArr
            })
        });
    };

		removeSelections = () => {
				let count = this.state.idxForRemove.length;
				let plural = count > 1;
				removeSelectedData(this.state.idxForRemove)
						.then(() => {
							NotificationManager.success(`item${plural ? 's' : ''} ${plural ? 'were' : 'was'} removed`);
							//noinspection JSAnnotator
                            this.setState({
									idxForRemove: [],
                                	uncheckedAll: true,
                                	checkedItemsArr: []
							});
							this.renderChildrenWithProps()
						})
						.catch(error => console.log('error in removeSelectioms: ', error))
		};

		sendIdxToParent = (arr) => {
				this.setState((prevState, props) => {
									return {idxForRemove: arr,
									}
							});
		};

		render = () => {

				let itemsLen = this.state.idxForRemove.length;
				return (
						<div className={itemsLen ? 'base select' : 'base'}>
										<span className="base-header">
												<div className="base-header-left">
													<span>{itemsLen} {`item${itemsLen > 1 ? 's' : ''}`} selected</span>
												</div>
												<div className="base-header-right">

														<IconButtons deleteAction={this.removeSelections} toggleMail={this.toggleMail}/>
												</div>
                    </span>
								<ListTable
										counts={this.props.counts}
										toggleRemove={this.toggleRemove}
										sendIdxToParent={this.sendIdxToParent}
										setChosenItem={this.props.setChosenItem}
										uncheckedAll={this.state.uncheckedAll}
										checkedItemsArr={this.state.checkedItemsArr}
								/>

								{this.state.sendMail && <SendMail toggleMail={this.toggleMail} itemIdxArr={this.state.idxForRemove}/> }

						</div>
				);
		}
}

export default Base

// <button onClick={() => this.setState({sendMail: true})}>Send mail</button>
//<SendMail isShown={this.state.sendMail}/>