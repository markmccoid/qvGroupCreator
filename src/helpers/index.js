var alertify = require('alertifyjs');


//confirmDialog
//@@Params
//  -- title - title shown in dialog header
//  -- msg - message shown in dialog
//  -- okfn - Callback when OK is pressed
//  -- cancelfn - Callback when Cancel is pressed
//---------------------------------------------
//--Example call:
// confirmDialog('Cancel Editing?','Ok to cancel adding of new field.',
//								this.cancelEditing, null);
//---------------------------------------------
export const confirmDialog = (title='', msg='', okfn, cancelfn = undefined, successMsg = undefined) => {
	alertify.confirm(title,  msg,
					() => {
						//Run the ok callback function
							okfn();
							successMsg && alertify.success(successMsg);
					},
					() => {
						//Run the cancel callback function only if it is defined
						if(cancelfn) {
							cancelfn();
						}
					})
};
