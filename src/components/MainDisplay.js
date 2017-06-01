import React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import _ from 'lodash';

import { createEmptyGroupObj } from '../api';
import AppSidebar from './AppSidebar';
import GroupCreator from './GroupCreator';

import { startLoadApplicationList,
 				 setSelectedApplication,
				 startAddGroup
			 } from '../actions';

class MainDisplay extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		//dispatch action to get the unique application names stored in qvGroups.json
		this.props.getApplicationNames();
	}
  componentWillReceiveProps(nextProps) {
      if (nextProps.location.pathname === '/') {
        this.props.setSelectedApplication('');
      }
  }

	handleLoadApplication = appName => {
		//call action to update redux store with clicked on application
		this.props.setSelectedApplication(appName);
	}

	render() {
		let selectedApplication = this.props.selectedApplication || '';
    console.log(this.props.location.pathname);
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
						{selectedApplication ?
							<a
                onClick={() => this.props.addGroup(createEmptyGroupObj(selectedApplication))}
                className="button primary"
              >
              Add New Group
              </a>
							:
							null
						}
						<Route path="/app/:appName" component={GroupCreator} />
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

export default withRouter(connect(mapStateToProps, {
	getApplicationNames: startLoadApplicationList,
	setSelectedApplication: setSelectedApplication,
	addGroup: startAddGroup
})(MainDisplay));


// <GroupCreator
// 	selectedApplication={this.props.selectedApplication}
// />
