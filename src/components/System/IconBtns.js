import React from 'react';
import IconButton from 'material-ui/IconButton';
import ActionDel from 'material-ui/svg-icons/action/delete';
import Mail from 'material-ui/svg-icons/communication/email'

const IconButtons = ({...props}) => (

		<div>
				<IconButton tooltip="Delete selections" onTouchTap={props.deleteAction}>
						<ActionDel />
				</IconButton>

				<IconButton tooltip="Send by email" onTouchTap={props.toggleMail}>
						<Mail/>
				</IconButton>
		</div>
);

export default IconButtons;