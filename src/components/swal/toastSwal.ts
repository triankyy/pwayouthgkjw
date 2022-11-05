import Swal from 'sweetalert2';

const Toast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 3000,
	timerProgressBar: true,
	didOpen: (toast: HTMLElement) => {
		toast.addEventListener('mouseenter', Swal.stopTimer);
		toast.addEventListener('mouseleave', Swal.resumeTimer);
	}
});

const toastSwal = ({ icon, title, text }: IToastSwal) => Toast.fire({ icon, title, text });

export default toastSwal;

type IconSwal = 'warning' | 'error' | 'success' | 'info' | 'question'

interface IToastSwal {
      icon: IconSwal;
      title: string;
	text?: string;
}