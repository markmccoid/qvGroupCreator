import React from 'react';
import PropTypes from 'prop-types';

class FieldItem extends React.Component {
  state = {
    editing: false,
    fieldLabel: this.props.fieldLabel
  }

	cancelEditing = () => {
		this.setState({
			editing: false,
			fieldLabel: ''
		});
	}
	componentDidUpdate() {
		//if editing and state and passed field label are equal
		//select the text in the input box
		if(this.state.editing && this.state.fieldLabel === this.props.fieldLabel) {
			let inputElem = this.state.fieldLabel;
			document.getElementById(inputElem).select();
		}
	}
  componentWillReceiveProps(nextProps) {
    //Having an issue with state of fieldlabel not updating correctly when
    //dragging and dropping to new order.  Below may break when actually updating
    //fieldLabel in edit mode, but may not since we will be updating redux store at same time.
    if (this.state.editing && this.props.fieldLabel !== nextProps.fieldLabel) {
      this.setState({fieldLabel: nextProps.fieldLabel});
    }
  }
  render() {
    let fieldJSX = <div
          className="sortable-item"
          onClick={() => this.setState({ editing: true, fieldLabel: this.props.fieldLabel })}
        >
          {this.props.fieldLabel}
        </div>;
    if (this.state.editing) {
      fieldJSX = <div className="sortable-item">
        <input
					id={this.state.fieldLabel}
          type="text"
          value={this.state.fieldLabel}
          onChange={(e) => this.setState({ fieldLabel: e.target.value })}
          onBlur={this.cancelEditing}
        />
      <a
        onClick={() => {
            console.log('onsave');
            this.props.onSaveLabel(this.props.fieldIndex, this.state.fieldLabel);
            this.setState({ editing: false });
          }
        }
      >Save</a>
				<a onClick={this.cancelEditing}>
					Cancel
				</a>
      </div>
    }
    return (
      <div> {fieldJSX}</div>
    )
  }

}

FieldItem.Proptypes = {
  fieldLabel: PropTypes.string,
  fieldIndex: PropTypes.number,
  onSaveLabel: PropTypes.func
};

export default FieldItem;
