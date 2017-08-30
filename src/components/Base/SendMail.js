import React, {
		Component,
		PropTypes,
} from 'react';

import {TextField, RaisedButton} from 'material-ui'

import {sendMailObjToDb} from '../../firebase/firebase'

import {NotificationManager} from 'react-notifications';

class SendMailModal extends Component {
		constructor(props) {
				super(props);

				this.state = {
						itemIdxArr: this.props.itemIdxArr,
						email: '',
						subject: '',
						text: '',
				}
		}

		componentWillReceiveProps(nextProps) {
				if (nextProps.isShown !== this.state.isShown) {
						this.setState((prevState, props) => {
								return {isShown: nextProps.isShown}
						});
				}
		}

		sendMail = () => {
				if (this.state.email.indexOf('@') < 0) {
						NotificationManager.error("email must include '@'");
						return
				}

				let objData = {...this.state};
				sendMailObjToDb(objData);
		};

		closeModal = () => {
				this.props.toggleMail();
		};

		handleSomeText = (e) => {
				let {name, value} = e.target;
				this.setState((prevState, props) => {
									return {[`${name}`]: value}
							});
		};


		render = () => {

				return (

						<div className="modal-container">

								<div className="demo-card-wide mdl-card mdl-shadow--2dp mail">

										<div className="mdl-card__title">
												<h2 className="mdl-card__title-text">Send mail</h2>
										</div>

										<div className="mdl-card__supporting-text">
												<TextField name="email" fullWidth={true} onChange={this.handleSomeText} floatingLabelText={'Email'}/>
												<TextField name="subject" fullWidth={true} onChange={this.handleSomeText} floatingLabelText={'Subject'}/>
												<TextField name="text" fullWidth={true} onChange={this.handleSomeText} floatingLabelText={'Text'} multiLine={true}/>
										</div>
										<div className="mdl-card__actions mdl-card--border footer">
												<RaisedButton onTouchTap={this.sendMail}>Send mail</RaisedButton>
										</div>
										<div className="mdl-card__menu menu">
												<span onClick={this.closeModal}>&times;</span>
										</div>
								</div>
						</div>
				);
		}
}


export default SendMailModal;
