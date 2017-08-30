import React, {
		Component
} from 'react';

import Item from './NewListItem'
import {Checkbox} from 'material-ui'

import * as firebase from 'firebase'


class NewTable extends Component {
		constructor(props) {
				super(props);

				this.state = {
						checkedAll: false,
						uncheckedAll: props.uncheckedAll,
						items: [],
						checkedItemsArr: props.checkedItemsArr,
						isScrolling: false,
						remIndex: null
				};
		}


		componentDidMount() {
				this.getDataFromFirebase()
						.then(() => setTimeout(this.countWidthTable, 3500))
						.catch(error => console.log('error: ', error));

		}

		shouldComponentUpdate(nextProps, nextState) {
				if (nextState.checkedItemsArr.length !== this.state.checkedItemsArr) return true;
				if (nextState.isScrolling !== this.state.isScrolling) return true;
				if (nextState.uncheckedAll !== this.state.uncheckedAll) return true;
				if (nextState.checkedAll !== this.state.checkedAll) return true;
				if (nextState.items.length !== this.state.items.length) return true;
				return false;
		}

		getDataFromFirebase = () => {
				let refOne = firebase.database().ref('columns');
				refOne.on('value', (snap) => {
					if (snap.val() !== null) {
                        let arr = Object.values(snap.val());
                        this.setState({
                            items: arr
                        })
                    } else {
                        this.setState({
                            items: []
                        })
					}
				});
				return Promise.resolve();
		};


		//Отмечаем/разотмечаем все чекбоксы
		toggleCheck = () => {
				let newArrIds = [];
				if (!this.state.checkedAll) {
						this.state.items.forEach(item => {
								newArrIds.push(item.id);
						});

						this.setState((prevState, props) => {
								return {
										checkedAll: true,
										uncheckedAll: false,
										checkedItemsArr: newArrIds
								}
						}, this.props.sendIdxToParent(newArrIds));
				} else {
						this.setState((prevState, props) => {
								return {
										checkedAll: false,
										uncheckedAll: true,
										checkedItemsArr: newArrIds
								}
						}, this.uncheckWithTimeout);
				}
		};

		uncheckWithTimeout = () => {
				this.props.sendIdxToParent(this.state.checkedItemsArr);
				setTimeout(this.setState((prevState, props) => {
						return {uncheckedAll: false}
				}), 1500)
		};


		//Создаем список
		createRows = (arr) => {
				return arr.map((item, i) => <Item
						key={i}
						item={item}
						remIndex={this.state.remIndex}
						setCheckedItemId={this.setCheckedItemId}
						setChosenItem={this.props.setChosenItem}
						uncheckedAll={this.state.uncheckedAll}
						checkedAll={this.state.checkedAll}/>)
		};


		setCheckedItemId = (id) => {
				let newArr = [...this.state.checkedItemsArr];
				let trigger = newArr.indexOf(id);
				if (trigger < 0) {
						newArr.push(id)
				} else {
						newArr = newArr.filter(item => item !== id);
				}

				this.setState((prevState, props) => {
						return {checkedItemsArr: newArr}
				}, this.props.sendIdxToParent(newArr));
		};

		onScrollBody = (e) => {
				if (e.target.scrollTop && this.state.isScrolling !== true) {
						this.setState((prevState, props) => {
								return {isScrolling: true}
						});
				} else if (e.target.scrollTop === 0) {
						this.setState((prevState, props) => {
								return {isScrolling: false}
						});
				}
		};


		countWidthTable = () => {
            let table = this.table,
                tableHeader = this.tableHeader;
            if (table.rows !==null && table.rows.length > 0) {

            for (let i = 0; i < table.rows[0].cells.length; i++) {
                let result = table.rows[0].cells[i].clientWidth;
                tableHeader.rows[0].cells[i].style.width = `${result}px`;
            }
            console.log('table was counted');
      	  	}
		};

		render = () => {

				let {items} = this.state;
				//debugger
				return (

						<div className="adminka-wrap">
								<div className={"adminka-table-header-fixed" + (this.state.isScrolling ? ' active' : '')}>
										<table className="adminka-table" ref={ref => this.tableHeader = ref}>
												<thead>
												<tr className="adminka-row adminka-list-header">
														<th className="adminka-cell checkbox">
																<Checkbox onCheck={this.toggleCheck} iconStyle={{marginRight: '0'}} style={{marginRight: '-16px !important'}}/>
														</th>
														<th className="adminka-cell prodName">Product Name</th>
														<th className="adminka-cell partNumber">Part Number</th>
														<th className="adminka-cell description">Description</th>
														<th className="adminka-cell count">Count</th>
														<th className="adminka-cell slider">Photos</th>
												</tr>
												</thead>
										</table>
								</div>
								<div className="adminka-layout-1" onScroll={this.onScrollBody}>

										<div className="adminka-layout-2">
												<table className="adminka-table" ref={ref => this.table = ref}>

														<tbody className="adminka-body">
														{items && this.createRows(items)}
														</tbody>
												</table>
										</div>

								</div>
						</div>

				);
		}
}

export default NewTable;








