import React from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import './notification.scss'

class Notification extends React.Component {

		// createNotification = (type, text) => {
		// 		return () => {
		// 				switch (type) {
		// 						case 'info':
		// 								NotificationManager.info('Info message');
		// 								break;
		// 						case 'success':
		// 								NotificationManager.success('Success message', 'Title here');
		// 								break;
		// 						case 'warning':
		// 								NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
		// 								break;
		// 						case 'error':
		// 								NotificationManager.error('Error message', 'Click me!', 5000, () => {
		// 										alert('callback');
		// 								});
		// 								break;
		// 				}
		// 		};
		// };

		render = () => {
				return (
						<div className="page-transition-animation">
								<NotificationContainer enterTimeout={800} leaveTimeout={500}/>
						</div>
				);
		}
}

export default Notification;