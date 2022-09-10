import Swal from 'sweetalert2';

const swalCustomClass = Swal.mixin({
	customClass: {
		confirmButton: 'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedSuccess MuiButton-sizeMedium MuiButton-containedSizeMedium css-ke5b6m-MuiButtonBase-root-MuiButton-root',
		cancelButton: 'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedError MuiButton-sizeMedium MuiButton-containedSizeMedium css-1sszw6i-MuiButtonBase-root-MuiButton-root'
	},
	buttonsStyling: false
});

const deleteSwal =  swalCustomClass.fire({
	title: 'Are you sure?',
	text: 'You won\'t be able to revert this!',
	icon: 'warning',
	showCancelButton: true,
	confirmButtonText: 'Yes, delete it!',
	cancelButtonText: 'No, cancel!',
	reverseButtons: true
}).then((result) => {
	if (result.isConfirmed) {
		swalCustomClass.fire(
			'Deleted!',
			'Your file has been deleted.',
			'success'
		);
	} else if (
	/* Read more about handling dismissals below */
		result.dismiss === Swal.DismissReason.cancel
	) {
		swalCustomClass.fire(
			'Cancelled',
			'Your imaginary file is safe :)',
			'error'
		);
	}
});

export default deleteSwal;