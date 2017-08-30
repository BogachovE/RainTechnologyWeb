import React, { PropTypes, Component } from 'react';
import {Link} from 'react-router'
// import classnames from 'classnames';


export default class NotFound extends Component {

		render = () => {

				return (
						<div className="not-found">
								<div className="not-found-container">
										<p>The page you're trying to reach doesn't exist.</p>
										<p>Return to <Link to="/photo" style={{color: '#4A96FA', fontSize: '2rem'}}>main</Link> </p>
								</div>
						</div>
				);
		};
}



