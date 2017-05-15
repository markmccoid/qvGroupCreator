import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select } from 'antd';
const Option = Select.Option;

class FieldItem extends React.Component {
  state = {
    editing: false,
    fieldValue: this.props.fieldValue,
		availableAnalytixFields: this.props.showSelectedValues ? this.props.analytixFields : []
  }

	cancelEditing = () => {
		this.setState({
			editing: false,
			fieldValue: ''
		});
	}
	componentDidUpdate() {
		//if editing and we are not allowing them to select values from list and (state and passed field value) are equal
		//Give the input element focus
		if(this.state.editing && !this.props.showSelectedValues && this.state.fieldValue === this.props.fieldValue) {
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
		this.setState({ editing: false });
	}

	handleFieldSearch = value => {
		const re = new RegExp(value, "gi")
		this.setState({
			fieldValue: value,
			availableAnalytixFields: this.props.analytixFields.filter(aField => aField.field.match(re))
		});
	}
  render() {
		let fieldJSX =
				<div
          className={this.props.customClass}
					style={{cursor: "pointer"}}
          onClick={() => this.setState({ editing: true, fieldValue: this.props.fieldValue })}
        >
          {this.props.fieldValue}
        </div>;
    if (this.state.editing) {
			if (this.props.showSelectedValues) {
				//--------------------------------------------
				//--Search analytixFields list
				const options = this.state.availableAnalytixFields.map(aField => <Option key={aField.field} >{aField.field}</Option>);
	      fieldJSX = <div className={this.props.customClass}>
					<Select
		        mode="combobox"
						id={this.props.fieldValue}
		        value={this.state.fieldValue}
						style= {{width: "200px"}}
		        notFoundContent=""
		        defaultActiveFirstOption={false}
		        showArrow={false}
		        filterOption={true}
						onBlur={() => this.cancelEditing()}
						onKeyPress={(e) => {
							console.log('keypress', e);
							if (e.key === 'Enter') {
								e.preventDefault();
								this.handleSave();
							}}
						}
						dropdownMatchSelectWidth={false}
		        onChange={this.handleFieldSearch}
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
				//--Does not want to search analytixFields list
				fieldJSX = <div className={this.props.customClass}>
					<input
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
	showSelectedValues: PropTypes.bool,  //If true we will show the analytixFields as select options
	customClass: PropTypes.string,
  onSave: PropTypes.func
};

export default connect(state => (
	{analytixFields: _.uniqBy(state.applications.selectedApplicationFields, 'field')}
))(FieldItem);
