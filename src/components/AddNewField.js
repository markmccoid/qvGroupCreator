import React from 'react';
import PropTypes from 'prop-types';

import FieldItem from './FieldItem';
import { confirmDialog } from '../helpers';

class AddNewField extends React.Component {
	state = {
		isAdding: false,
		fieldLabel: 'Field Label',
		fieldName: 'Field Name'
	}
	handleSave= () => {
		this.props.onNewGroupField(this.state.fieldLabel, this.state.fieldName);
		this.setState(
			{ isAdding: false,
				fieldLabel: '',
				fieldName: ''
			});
	}
	cancelEditing = () => {
		//Canceling editing, but not clearing label and name.
		//May want to clear label and name.
		this.setState({ isAdding: false });
	}
	render() {
		let stateJSX = <a onClick={() => this.setState({ isAdding: true })}>Add Field</a>;
		if (this.state.isAdding) {
			stateJSX = <div className="gc-adding-field">
								<FieldItem
									fieldValue={this.state.fieldLabel}
									customClass="sortable-item"
									onSave={newFieldLabel => this.setState({ fieldLabel: newFieldLabel })}
								/>
								<FieldItem
									fieldValue={this.state.fieldName}
									customClass="sortable-item"
									showSelectedValues
									onSave={newFieldName => this.setState({ fieldName: newFieldName })}
								/>

								<a onMouseDown={() => {
											this.handleSave();
										}
									}
								>Save</a>

							<a onClick={() => {
										confirmDialog('Cancel Editing?','Ok to cancel adding of new field.', this.cancelEditing, null);
									}
								}>
									Cancel
								</a>
							</div>
			}
		return (
			<div>{ stateJSX }</div>
			);
	}
}

AddNewField.propTypes = {
	onNewGroupField: PropTypes.func
}
export default AddNewField;
