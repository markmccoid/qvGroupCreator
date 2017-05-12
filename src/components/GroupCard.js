import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import { SortableContainer,
				 SortableElement,
				 SortableHandle,
				 arrayMove } from 'react-sortable-hoc';

import FieldItem from './FieldItem';

//Create the reac-sortable-hoc Components
const DragHandle = SortableHandle((props) => {
	return (
		<div className="sortable-handle">
			<div>Label</div>
			<div>Field</div>
		</div>
	);
});

const SortableItem = SortableElement((props) => {
	//calls passed onSaveLabel function passing in
	//required field index so we update the right label
		const handleSaveFields = (newLabel = props.value.fieldLabel, newName = props.value.fieldName) => {
			props.onGroupFieldUpdate(props.fieldIndex, newLabel, newName);
		}
		return (
			<div className="sortable-field-container">
				<DragHandle />
				<div className="sortable-field-values-container">

					<FieldItem
						fieldValue={props.value.fieldLabel}
						customClass="sortable-item"
						onSave={newFieldLabel => handleSaveFields(newFieldLabel, props.value.fieldName)}
					/>
					<FieldItem
						fieldValue={props.value.fieldName}
						customClass="sortable-item"
						showSelectedValues
						onSave={newFieldName => handleSaveFields(props.value.fieldLabel, newFieldName)}
					/>

				</div>
			</div>
		)
	}
);

const SortableList = SortableContainer(({ items, onGroupFieldUpdate }) => {

	return (
		<div className="sortable-list">
			{items.map((value, idx) => {
					return (
						<SortableItem key={`item-${idx}`}
							index={idx}
							value={value}
							fieldIndex={idx}
							onGroupFieldUpdate={onGroupFieldUpdate}
						/>
					);
				})
			}
		</div>
	);
});


//GROUPCARD Component
class GroupCard extends React.Component {
	constructor(props) {
		super(props);
	}

	handleGroupFieldUpdate = (changedIdx, newLabel, newName) => {
		 //Since we are going to change the label based on the index that was used when
		 //the FieldItem was created, we need to make sure the array we are modifying
		 //looks the same
		 let newFields = _.sortBy([...this.props.fields], 'fieldOrder');
		 let newArrayOfFields = newFields.map((obj, ObjIndex) => {
			 let newObj = {...obj};
			 if (ObjIndex === changedIdx) {
				 newObj.fieldLabel = newLabel;
				 newObj.fieldName = newName;
			 }
			 return newObj;
		 });
		 //dispatch action to update fields for group in redux store and on server.
		 this.props.onUpdateGroupFields(this.props.group.id, newArrayOfFields);
	}

	handleGroupNameUpdate = (newGroupName) => {
		//We can either create a new server REST Put call to change a single group title OR
		//Send over the whole group and send a put to /api/groups
		let newGroup = {...this.props.group};
		newGroup.groupName = newGroupName;
		newGroup.modifyDate = moment().unix();
		newGroup.fields = this.props.fields;
		console.log('newGroup', newGroup);
		this.props.onUpdateGroup(newGroup);
	}
	render() {
		let { groupName, groupType, groupNotes } = this.props.group;
	  //create a copy of the fields being passed and sort by their fieldOrder property
		let newFields = _.sortBy([...this.props.fields], 'fieldOrder');

		//function called when a drap-drop sort operation has completed
		const onSortEnd = ({oldIndex, newIndex}) => {
			//When user changes order of fields:
			//Create new array of field objects using arrayMove function from react-sortable-hoc
			let newArrayOfFields = arrayMove(newFields, oldIndex, newIndex)
				//loop through this new sorted array and update the fieldOrder field
				//the arrayMove sorts the array, but we also need to update the fieldOrder field
				//in the group object
				.map((obj, idx) => {
					return {
						...obj,
						fieldOrder: idx + 1
					}
				});
			//dispatch action to update fields for group in redux store and on server.
			this.props.onUpdateGroupFields(this.props.group.id, newArrayOfFields);
		}

		return (
			<div className="gc-container" key={this.props.group.id}>
				<div className="gc-title">
					<FieldItem
						fieldValue={groupName}
						customClass="gc-title"
						onSave={(newGroupName) => this.handleGroupNameUpdate(newGroupName)}
					/>
				</div>

				<div className="gc-description">
					<div style={{display: "flex"}}>
						<h6>Group Type: </h6>
						<h6 style={{padding: "0 10px"}}>{groupType}</h6>
					</div>

					<SortableList
						items={newFields}
						onSortEnd={onSortEnd}
						onGroupFieldUpdate={this.handleGroupFieldUpdate}
						useDragHandle={true} />

				</div>

				<div
					className="hover-buttons close"
					onClick={() => alert('edit')}
				>
					<img src="./images/close-x.png" width="16" height="16" />
				</div>
				<div className="hover-buttons edit" onClick={()=> alert('edit')}>
					<img src="./images/edit-pen.png" width="16" height="16" />
				</div>
			</div>
		);
	}
}
//#--PropTypes---###//
GroupCard.propTypes = {
	group: PropTypes.object,
	fields: PropTypes.array,
	analytixFields: PropTypes.array,
	onUpdateGroupFields: PropTypes.func,
	onUpdateGroup: PropTypes.func
};

export default GroupCard;
