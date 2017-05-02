import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import AppSidebar from './AppSidebar';
import GroupCreator from './GroupCreator';

import { startLoadApplicationList,
 				 setSelectedApplication
			 } from '../actions';

class MainDisplay extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		//dispatch action to get the unique application names stored in qvGroups.json
		this.props.getApplicationNames();
	}

	handleLoadApplication = appName => {
		//call action to update redux store with clicked on application
		this.props.setSelectedApplication(appName);
	}

	render() {
		let selectedApplication = this.props.selectedApplication || '';
		return (
			<div className="content-container">
				<nav className="content-nav">
					<h5>Applications</h5>
					<AppSidebar
						applicationList={this.props.applicationList}
						onLoadApplication={this.handleLoadApplication}
					/>
				</nav>
				<main className="content-body">
						<h2>	{selectedApplication ? selectedApplication + ' Groups' : 'Select an Application'  }</h2>
						<GroupCreator
							selectedApplication={this.props.selectedApplication}
						/>
				</main>
			</div>
		);
}
};

const mapStateToProps = (state) => {
	return {
		applicationList: state.applications.applicationList || [],
		selectedApplication: state.applications.selectedApplication || ''
	}
}

// const mapDispatchToProps = dispatch => {
// 	return {
// 		onSaveItem(uid, itemObj) {
// 			dispatch(startSaveItem(uid, itemObj));
// 		}
// 	};
// };

export default connect(mapStateToProps, {
	getApplicationNames: startLoadApplicationList,
	setSelectedApplication: setSelectedApplication
})(MainDisplay);
