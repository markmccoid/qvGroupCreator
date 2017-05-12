import React from 'react';
import PropTypes from 'prop-types';

import GroupCard from './GroupCard';

class GroupsDisplay extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="group-cards-container">
				{
					this.props.groups.map(group => {
						//Get the fields for the group we are working on
						//The fields are in an object where the keys are the group ids
						let groupFields = this.props.groupFields[group.id] || [];
						return (
								<GroupCard key={group.id}
									group={group}
									fields={groupFields}
									analytixFields={this.props.analytixFields}
									onUpdateGroupFields={this.props.onUpdateGroupFields}
									onUpdateGroup={this.props.onUpdateGroup}
								/>
						);
					})
				}
			</div>
		);
	}
}

//#--PropTypes---###//
GroupsDisplay.propTypes = {
	groups: PropTypes.array,
	groupFields: PropTypes.object,
	analytixFields: PropTypes.array
}

export default GroupsDisplay;



//-------------------------------

// class GroupsDisplay extends React.Component {
// 	constructor(props) {
// 		super(props);
// 	}
//
// 	render() {
// 		return (
// 			<div>
// 				{
// 					this.props.groups.map(group => {
// 						let fields = this.props.groupFields[group.id] || [];
// 						let fieldJSX = fields.map(field => {
// 							return (
// 									<li key={field.fieldName}>{field.fieldName}</li>
// 							);
// 						});
// 						return (
// 							<div key={group.id}>
// 								<h4>{group.groupName}</h4>
// 								<ul>{fieldJSX}</ul>
// 							</div>
// 						);
// 					})
// 				}
// 			</div>
// 		);
// 	}
// }
//
// //#--PropTypes---###//
// GroupsDisplay.propTypes = {
// 	groups: PropTypes.array,
// 	groupFields: PropTypes.object
// }
//
// export default GroupsDisplay;
