import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { startLoadGroups,
				 startLoadGroupFields,
				 startLoadAnalytixFields,
				 startUpdateGroupFields,
				 startUpdateGroup
			 } from '../actions';

import GroupsDisplay from './GroupsDisplay';

class GroupCreator extends React.Component {
	constructor(props) {
		super(props);

	}
	//First mounting will not have the selectedApplication set, so we only load
	//Groups and Fields when component receives new props.
	componentWillReceiveProps(nextProps) {
		if (this.props.selectedApplication !== nextProps.selectedApplication) {
			this.props.startLoadGroups(nextProps.selectedApplication);
			this.props.startLoadGroupFields(nextProps.selectedApplication);
			this.props.startLoadAnalytixFields(nextProps.selectedApplication);
		}
	}
	render() {
		//Prep analytix fields for use in the FieldItem component
		let isAnaltixFieldsAvaliable = false;
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

export default connect(mapStateToProps, {
	startLoadGroups: startLoadGroups,
	startLoadGroupFields: startLoadGroupFields,
	startLoadAnalytixFields: startLoadAnalytixFields,
	startUpdateGroupFields: startUpdateGroupFields,
	startUpdateGroup: startUpdateGroup
})(GroupCreator);
