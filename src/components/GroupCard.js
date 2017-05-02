import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { SortableContainer,
				 SortableElement,
				 SortableHandle,
				 arrayMove } from 'react-sortable-hoc';

import FieldItem from './FieldItem';

//Create the reac-sortable-hoc Components
const DragHandle = SortableHandle((props) => {
	return (
		<div className="sortable-handle"></div>
	);
});

const SortableItem = SortableElement((props) => {
		return (
			<div className="sortable-field-container">
				<DragHandle/>
				<div className="sortable-field-values-container">

					<FieldItem
						fieldLabel={props.value.fieldLabel}
						fieldIndex={props.fieldIndex}
						onSaveLabel={props.onSaveLabel}
					/>

					<div className="sortable-item">
						{props.value.fieldName}
					</div>
				</div>
			</div>
		)
	}
);

const SortableList = SortableContainer(({ items, onSaveLabel }) => {
	return (
		<div className="sortable-list">
			{items.map((value, idx) => {
					return (
						<SortableItem key={`item-${idx}`}
							index={idx}
							value={value}
							fieldIndex={idx}
							onSaveLabel={onSaveLabel}/>
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

	handleGroupFieldUpdate = (changedIdx, newLabel) => {
		 //Since we are going to change the label based on the index that was used when
		 //the FieldItem was created, we need to make sure the array we are modifying
		 //looks the same
		 let newFields = _.sortBy([...this.props.fields], 'fieldOrder');
		 let newArrayOfFields = newFields.map((obj, ObjIndex) => {
			 let newObj = {...obj};
			 if (ObjIndex === changedIdx) {
				 newObj.fieldLabel = newLabel;
			 }
			 return newObj;
		 });
		 //dispatch action to update fields for group in redux store and on server.
		 this.props.onUpdateGroupFields(this.props.group.id, newArrayOfFields);
	}
	render() {
		let { groupName, groupType, groupNotes } = this.props.group;
	  //create a copy of the fields being passed and sort by their fieldOrder property
		let newFields = _.sortBy([...this.props.fields], 'fieldOrder');

		//function called when a drap-drop sort operation has completed
		const onSortEnd = ({oldIndex, newIndex}) => {
			//When user changes order of fields:
			//Create new array of field objects:
			let newArrayOfFields = arrayMove(newFields, oldIndex, newIndex)
				//loop through this new sorted array and update the fieldOrder field
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
					<a href="#" target="_blank"><h4>{groupName}</h4></a>
				</div>

				<div className="gc-description">
					<div style={{display: "flex"}}>
						<h5>Group Type: </h5>
						<h5 style={{padding: "0 10px"}}>{groupType}</h5>
					</div>

					<SortableList
						items={newFields}
						onSortEnd={onSortEnd}
						onSaveLabel={this.handleGroupFieldUpdate}
						useDragHandle={true} />

				</div>

				<div className="hover-buttons close" onClick={() => alert('edit')}>
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
	onUpdateGroupFields: PropTypes.func
};

export default GroupCard;
