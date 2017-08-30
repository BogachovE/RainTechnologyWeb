import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router'
import * as firebase from 'firebase'

import IconButton from 'material-ui/IconButton';
import FilterList from 'material-ui/svg-icons/content/filter-list'
import Settings from 'material-ui/svg-icons/action/settings'

import Preloader from '../System/Preloader'
import Notification from '../System/Notification'


// if (process.env.NODE_ENV !== 'production') {
// 		const {whyDidYouUpdate} = require('why-did-you-update');
// 		whyDidYouUpdate(React)
// }


class App extends Component {
		constructor(props) {
				super(props);


				this.fireDb = firebase.database();

				this.state = {
						counts: {},
						showLoader: false,
						chosenItem: null,
						message: '',
				};

		}

		componentWillMount() {
				// this.toggleLoader(false);
				this.getDbCounts();
		}

		componentDidMount() {
				let dataLength = Object.keys(this.state.counts).length;
				dataLength !== 0 && this.toggleLoader(true);
		}

		updateStateCount = (obj) => {
				this.setState({
						counts: obj
				})
		};

		componentWillReceiveProps(nextProps, nextState) {
				if(nextState.chosenItem !== this.state.chosenItem){
						this.renderChildrenWithProps()
				}
		}

		toggleLoader = (isShown) => {
				this.setState({
						showLoader: !isShown
				})
		};

		removeChosenItem = () => {
			this.setState((prevState, props) => {
								return {
										chosenItem: null
								}
						});
			console.log("rerender");
			return Promise.resolve()
		};

		setChosenItem = (item) => {
				browserHistory.push('/photo');
				this.setState((prevState, props) => {
						return {chosenItem: item}
				});

				// this.renderChildrenWithProps();
		};

		renderChildrenWithProps = () => {
				return React.Children.map(this.props.children, (child) => {
						return React.cloneElement(child, {
								counts: this.state.counts,
								chosenItem: this.state.chosenItem,
								setChosenItem: this.setChosenItem,
								removeChosenItem: this.removeChosenItem
						})
				});
		};

		getDbCounts = () => {
				let counts = this.fireDb.ref().child("columns");
				counts.on('value', (snap) => {
						let val = snap.val();
						this.updateStateCount(val)
				})
		};

		goToPath = (e) => {
				let path = e.target.attributes.data.nodeValue;
				browserHistory.push(path);
				this.removeChosenItem();
		};

		makeLinkActive = (path) => {
				let currLocation = browserHistory.getCurrentLocation().pathname;
				if (currLocation === '/') currLocation = '/photo';
				return path === currLocation ? 'btn header active' : 'btn header'
		};



		render = () => {

				let currLocation = browserHistory.getCurrentLocation().pathname;

				const makeFlex = () => {
					return currLocation === '/base' ? 'mdl-layout__content flex' : 'mdl-layout__content'
				};

				return (
						<div className=" mdl-layout mdl-js-layout mdl-layout--fixed-header">
								<header className="mdl-layout__header">
										<div className="mdl-layout__header-row">
												<nav className="mdl-navigation">
														<Link to={'/photo'} className="btn header" style={{marginLeft: '0'}} activeClassName={'btn header active'}>Make Photo</Link>
														{/*<button data="/photo" style={{marginLeft: '0'}} className={this.makeLinkActive('/photo')}*/}
														        {/*onClick={this.goToPath}>Make photo*/}
														{/*</button>*/}
														<Link to="/base" className="btn header" activeClassName={'btn header active'}>Base</Link>
														{/*<button data="/base" className={this.makeLinkActive('/base')} onClick={this.goToPath}>Base*/}
														{/*</button>*/}
												</nav>
												{currLocation === '/base' &&
												<div>
														<IconButton>
																<FilterList />
														</IconButton>
														<IconButton>
																<Settings />
														</IconButton>
												</div>
												}
										</div>
								</header>
								<main className={makeFlex()}>
										{this.renderChildrenWithProps()}
								</main>

								<Notification/>
						</div>
				);
		}
}

export default App;


