# FieldItem Component - FieldItem.js

The component creates an editable field.  Initially, the value is displayed in as text and then when clicked on, an input box is shown for the user to enter a new value in.

**This component has two editing modes.**

1. Standard text input edit.  User can enter anything in the input box when editing.
2. Drop down select.  User can select an option from a drop down select control. This mode uses the **\<Select \/\>** react component from [ant design](https://ant.design/components/select/) to allow for a drop down select.

A **"Save"** and **"Cancel"** button are provided.  When **"Cancel"** is pressed, any edits are discarded and the user is returned to the original static text.  This cancel operation is also performed on a blur action.

When **"Save"** is pressed the **onSave** function that is passed as a prop is called.

### Props List:

- **fieldValue**
- **showPickList** - Boolean, when true, component will display searchList
- **pickListValues** - Array of objects in shape { key, label } where **label** is what you see in dropdown and is what is searched, but **key** is what is shown when an item is selected.
- **allowPickListSearch** -- Boolean, when true, allows searching of pick list by typing.  
- **onSave**
- **searchLabel**
- **customClass**

### Dropdown Select Mode details

To enable this mode you must pass the **showSearchList** boolean prop as true.  Second, you must pass a list of items to display in the **searchList** prop.
The **searchList** is an array of object with the shape of:
``` javascript
{
    key: keyValue,      
    label: labelValue
}
```
- **key** - will be the value displayed in the edit box and the value that is passed to the save function if one it's values is selected
- **label** - will be the value displayed in the drop-down AND the value *searched*

Most of the time passing the key and label as the same value will suffice.