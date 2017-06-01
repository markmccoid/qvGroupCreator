import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Select } from 'antd';
const Option = Select.Option;

//Used for regular input and textarea input needs
const CustomInput = (props) => {
	//don't want to spread inputType to these components, getting rid of it.
	let newProps = _.omit(props, 'inputType');
	if (props.inputType === 'textarea') {
		return (
			<textarea
				{...newProps}
				/>
		);
	} else {
		return (
			<input
				{...newProps}
			/>
		);
	}
};

class FieldItem extends React.Component {
  state = {
    editing: false,
    fieldValue: this.props.fieldValue,
		availablepickListValues: this.props.inputType === 'select' ? this.props.pickListValues : []
  }

	cancelEditing = () => {
		this.setState({
			editing: false,
			fieldValue: '',
			availablepickListValues: this.props.inputType === 'select' ? this.props.pickListValues : []
		});
	}
	componentDidUpdate() {
		//if editing and we are not allowing them to select values from list and (state and passed field value) are equal
		//Give the input element focus
		if(this.state.editing && !this.props.inputType === 'select' && this.state.fieldValue === this.props.fieldValue) {
			//I have assign the fieldValue as the html id attribute on the input element
			let inputElem = this.props.fieldValue;
			//Give this element focus. Then the onFocus event actually selects the text
			document.getElementById(inputElem).focus();
		}
	}

//calls the passed in onSave function with the state fieldValue as an argument
//then set editing state to false
	handleSave = () => {
		this.props.onSave(this.state.fieldValue);
		this.setState({ editing: false, availablepickListValues: this.props.inputType === 'select' ? this.props.pickListValues : [] });
	}

	handleFieldSearch = value => {
		//Take the value typed and search the "label" key in the pickListValues object prop
		const re = new RegExp(value, "gi")
		this.setState({
			availablepickListValues: this.props.pickListValues.filter(aField => aField.label.match(re))
		});
	}

  render() {

		let fieldClass = this.props.customClass + " field-item-js";
		let selectMode = this.props.allowPickListSearch ? "combobox" : "";

		let fieldJSX =
				<div
          className={fieldClass}
					style={{cursor: "pointer"}}
          onClick={() => this.setState({ editing: true, fieldValue: this.props.fieldValue })}
        >
          {this.props.fieldValue}
        </div>;
    if (this.state.editing) {
			if (this.props.inputType === 'select') {
				//--------------------------------------------
				//--Search pickListValues list
				const options = this.state.availablepickListValues.map(aField => <Option key={aField.key} value={aField.key} >{aField.label}</Option>);
	      fieldJSX =
					<div
						className={fieldClass}
						onKeyPress={e => {
							if (e.key === 'Enter') {
								e.preventDefault();
								this.handleSave();
							}
						}}>
					<Select
					  mode={selectMode}
					  labelInValue
					  value={{key: this.state.fieldValue}}
					  style= {{width: "200px"}}
					  notFoundContent=""
					  defaultActiveFirstOption={false}
					  showArrow={!this.props.allowPickListSearch}
					  filterOption={false}
					  onBlur={() => this.cancelEditing()}
					  dropdownMatchSelectWidth={false}
					  onSearch={this.handleFieldSearch}
					  onChange={value => this.setState({ fieldValue: value.key	})}
					>
		        {options}
		      </Select>
		      <a
		        onMouseDown={() => {
								this.handleSave();
		          }
						}
		      >Save</a>
					<a onClick={this.cancelEditing}>
						Cancel
					</a>
	      </div>
	    } else {
				//--------------------------------------------
				//--Does not want to search pickListValues list
				fieldJSX = <div className={fieldClass}>
					<CustomInput
						id={this.props.fieldValue}
						type="text"
						value={this.state.fieldValue}
						onFocus={() => document.getElementById(this.props.fieldValue).select()}
						onChange={(e) => this.setState({ fieldValue: e.target.value })}
						onBlur={this.cancelEditing}
						onKeyPress={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								this.handleSave();
							}
						}}
						inputType={this.props.inputType}
					/>
					<a
						onMouseDown={() => {
								this.handleSave();
							}
						}
					>Save</a>
					<a onClick={this.cancelEditing}>
						Cancel
					</a>
				</div>
			}
		}
    return (
      <div> {fieldJSX}</div>
    )
  }

}

FieldItem.Proptypes = {
  fieldValue: PropTypes.string,
	showPickList: PropTypes.bool,  //If true we will show the pickListValues as select options
	inputType: PropTypes.oneOf(['select', 'input', 'textarea']),
	pickListValues: PropTypes.array,
	allowPickListSearch: PropTypes.bool,
	customClass: PropTypes.string,
	onSave: PropTypes.func
};

export default FieldItem;
