import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { startLoadGroups,
				 startLoadGroupFields,
				 startLoadAnalytixFields,
				 startUpdateGroupFields
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
		console.log('groupCreator-groupFields', nextProps.groupFields);
	}
	render() {
			return (
				<GroupsDisplay
					groups={this.props.groups}
					groupFields={this.props.groupFields}
					onUpdateGroupFields={this.props.startUpdateGroupFields}
				/>

		);
	}
}

const mapStateToProps = (state) => {
	return {
		groups: state.groups.groupsInfo,
		groupFields: state.groups.groupFields,
		analytixFields: state.fields
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
	startUpdateGroupFields: startUpdateGroupFields
})(GroupCreator);
