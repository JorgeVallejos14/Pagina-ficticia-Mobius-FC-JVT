document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('register-form');
	if (!form) {
		return;
	}

	const fields = {
		nombre: document.getElementById('nombre-completo'),
		fechaNacimiento: document.getElementById('fecha-nacimiento'),
		email: document.getElementById('email'),
		confirmarEmail: document.getElementById('confirmar-email'),
		contrasena: document.getElementById('contrasena'),
		confirmarContrasena: document.getElementById('confirmar-contrasena'),
		terminos: document.querySelector('input[name="acepto-hincha"]'),
	};
	const registerCard = document.querySelector('.form-card');

	const errors = {
		nombre: document.getElementById('error-nombre'),
		edad: document.getElementById('error-edad'),
		email: document.getElementById('error-email'),
		confirmarEmail: document.getElementById('error-confirmar-email'),
		contrasena: document.getElementById('error-contrasena'),
		confirmarContrasena: document.getElementById('error-confirmar-contrasena'),
		terminos: document.getElementById('error-terminos'),
	};

	const termsGroup = document.getElementById('terms-group');

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
	const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

	function setFieldState(field, errorElement, message) {
		const group = field ? field.closest('.form-group') : null;
		if (group) {
			group.classList.toggle('invalid', Boolean(message));
		}
		if (errorElement) {
			errorElement.textContent = message || '';
		}
		if (field) {
			field.setAttribute('aria-invalid', message ? 'true' : 'false');
		}
	}

	function setTermsState(message) {
		if (termsGroup) {
			termsGroup.classList.toggle('invalid', Boolean(message));
		}
		if (errors.terminos) {
			errors.terminos.textContent = message || '';
		}
		if (fields.terminos) {
			fields.terminos.setAttribute('aria-invalid', message ? 'true' : 'false');
		}
	}

	function showSuccessMessage() {
		const fullName = fields.nombre.value.trim();
		const firstName = fullName.split(/\s+/)[0] || 'socio';

		form.classList.add('is-hidden');

		let successMessage = registerCard.querySelector('.success-message');
		if (!successMessage) {
			successMessage = document.createElement('div');
			successMessage.className = 'success-message';
			successMessage.innerHTML = `
				<h3>¡Bienvenido al Mobius FC, ${firstName}!</h3>
				<p>Tu registro fue enviado correctamente. Ya formas parte de la familia esmeralda de Station Square.</p>
				<a class="btn-cta" href="index.html">Volver al inicio</a>
			`;
			registerCard.appendChild(successMessage);
		}
	}

	function calculateAge(dateString) {
		if (!dateString) {
			return null;
		}

		const birthDate = new Date(dateString + 'T00:00:00');
		if (Number.isNaN(birthDate.getTime())) {
			return null;
		}

		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDifference = today.getMonth() - birthDate.getMonth();

		if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
			age -= 1;
		}

		return age;
	}

	function validateNombre() {
		const value = fields.nombre.value.trim();
		if (value.length < 3) {
			setFieldState(fields.nombre, errors.nombre, 'El nombre debe tener al menos 3 caracteres.');
			return false;
		}

		if (/\d/.test(value)) {
			setFieldState(fields.nombre, errors.nombre, 'El nombre no debe contener números.');
			return false;
		}

		setFieldState(fields.nombre, errors.nombre, '');
		return true;
	}

	function validateEdad() {
		const age = calculateAge(fields.fechaNacimiento.value);
		if (age === null) {
			setFieldState(fields.fechaNacimiento, errors.edad, 'Ingresa una fecha de nacimiento válida.');
			return false;
		}

		if (age < 18) {
			setFieldState(fields.fechaNacimiento, errors.edad, 'Debes ser mayor de 18 años para registrarte.');
			return false;
		}

		setFieldState(fields.fechaNacimiento, errors.edad, '');
		return true;
	}

	function validateEmail() {
		const emailValue = fields.email.value.trim();
		if (!emailRegex.test(emailValue)) {
			setFieldState(fields.email, errors.email, 'Ingresa un email válido con formato y dominio correctos.');
			return false;
		}

		setFieldState(fields.email, errors.email, '');
		return true;
	}

	function validateConfirmarEmail() {
		const emailValue = fields.email.value.trim();
		const confirmarValue = fields.confirmarEmail.value.trim();

		if (!confirmarValue) {
			setFieldState(fields.confirmarEmail, errors.confirmarEmail, 'Confirma tu email.');
			return false;
		}

		if (emailValue !== confirmarValue) {
			setFieldState(fields.confirmarEmail, errors.confirmarEmail, 'Los emails no coinciden.');
			return false;
		}

		setFieldState(fields.confirmarEmail, errors.confirmarEmail, '');
		return true;
	}

	function validateContrasena() {
		const value = fields.contrasena.value;
		if (!passwordRegex.test(value)) {
			setFieldState(fields.contrasena, errors.contrasena, 'La contraseña debe tener 8 caracteres, una mayúscula, un número y un carácter especial.');
			return false;
		}

		setFieldState(fields.contrasena, errors.contrasena, '');
		return true;
	}

	function validateConfirmarContrasena() {
		const passwordValue = fields.contrasena.value;
		const confirmValue = fields.confirmarContrasena.value;

		if (!confirmValue) {
			setFieldState(fields.confirmarContrasena, errors.confirmarContrasena, 'Confirma tu contraseña.');
			return false;
		}

		if (passwordValue !== confirmValue) {
			setFieldState(fields.confirmarContrasena, errors.confirmarContrasena, 'Las contraseñas no coinciden.');
			return false;
		}

		setFieldState(fields.confirmarContrasena, errors.confirmarContrasena, '');
		return true;
	}

	function validateTerminos() {
		if (!fields.terminos.checked) {
			setTermsState('Debes aceptar ser hincha del más grande de Station Square.');
			return false;
		}

		setTermsState('');
		return true;
	}

	function validateForm() {
		const validations = [
			validateNombre(),
			validateEdad(),
			validateEmail(),
			validateConfirmarEmail(),
			validateContrasena(),
			validateConfirmarContrasena(),
			validateTerminos(),
		];

		return validations.every(Boolean);
	}

	fields.nombre.addEventListener('input', validateNombre);
	fields.nombre.addEventListener('blur', validateNombre);
	fields.fechaNacimiento.addEventListener('input', validateEdad);
	fields.fechaNacimiento.addEventListener('blur', validateEdad);
	fields.email.addEventListener('input', () => {
		validateEmail();
		if (fields.confirmarEmail.value.trim()) {
			validateConfirmarEmail();
		}
	});
	fields.confirmarEmail.addEventListener('input', validateConfirmarEmail);
	fields.contrasena.addEventListener('input', () => {
		validateContrasena();
		if (fields.confirmarContrasena.value.trim()) {
			validateConfirmarContrasena();
		}
	});
	fields.confirmarContrasena.addEventListener('input', validateConfirmarContrasena);
	fields.terminos.addEventListener('change', validateTerminos);

	form.addEventListener('submit', (event) => {
		event.preventDefault();

		if (validateForm()) {
			Object.values(errors).forEach((errorElement) => {
				if (errorElement) {
					errorElement.textContent = '';
				}
			});
			form.querySelectorAll('.invalid').forEach((element) => element.classList.remove('invalid'));
			showSuccessMessage();
			return;
		}

		const firstInvalidField = form.querySelector('.invalid input, .invalid select');
		if (firstInvalidField) {
			firstInvalidField.focus();
		}
	});
});
