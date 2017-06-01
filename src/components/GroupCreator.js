import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import { startLoadGroups,
				 startLoadGroupFields,
				 startLoadAnalytixFields,
				 startUpdateGroupFields,
				 startUpdateGroup,
				 setSelectedApplication,
				 startDeleteGroup
			 } from '../actions';

import GroupsDisplay from './GroupsDisplay';

class GroupCreator extends React.Component {
	constructor(props) {
		super(props);

	}
	 componentDidMount() {
		//Load the Groups, GroupFields and Analytix fields for the application selected.
		this.props.startLoadGroups(this.props.match.params.appName);
		this.props.startLoadGroupFields(this.props.match.params.appName);
		this.props.startLoadAnalytixFields(this.props.match.params.appName);
		this.props.setSelectedApplication(this.props.match.params.appName);
	}

	componentWillReceiveProps(nextProps) {
		//This will run when application is changed.
		//Need to run because the initial componentDidMount only runs when mounting
		if (this.props.match.params.appName !== nextProps.match.params.appName) {
			this.props.startLoadGroups(nextProps.match.params.appName);
			this.props.startLoadGroupFields(nextProps.match.params.appName);
			this.props.startLoadAnalytixFields(nextProps.match.params.appName);
			this.props.setSelectedApplication(nextProps.match.params.appName);
		}
	}
	render() {
		//Prep analytix fields for use in the FieldItem component
		let isAnaltixFieldsAvaliable = false;
		let currentApplication = this.props.match.params.appName;

		if (this.props.analytixFields) { isAnaltixFieldsAvaliable = true }
		let analytixFieldsFormatted =  isAnaltixFieldsAvaliable ? this.props.analytixFields.map(field => {
			return {
				key: field.field,
				label: field.field
			};
		}) : [];
			return (
				<GroupsDisplay
					groups={this.props.groups}
					groupFields={this.props.groupFields}
					analytixFields={analytixFieldsFormatted}
					onUpdateGroupFields={this.props.startUpdateGroupFields}
					onUpdateGroup={this.props.startUpdateGroup}
					onDeleteGroup={this.props.deleteGroup}
				/>

		);
	}
}

const mapStateToProps = (state) => {
	return {
		groups: state.groups.groupsInfo,
		groupFields: state.groups.groupFields,
		analytixFields: state.applications.selectedApplicationFields
	}
}

//#--PropTypes---###//
GroupCreator.propTypes = {
	selectedApplication: PropTypes.string
};

export default withRouter(connect(mapStateToProps, {
	startLoadGroups: startLoadGroups,
	startLoadGroupFields: startLoadGroupFields,
	startLoadAnalytixFields: startLoadAnalytixFields,
	startUpdateGroupFields: startUpdateGroupFields,
	startUpdateGroup: startUpdateGroup,
	setSelectedApplication: setSelectedApplication,
	deleteGroup: startDeleteGroup
})(GroupCreator));
