export default (() => {
	const getContactFormData = form => {
		const enquiryTypeSelector = form.querySelector('[name="enquiryType"]');
		const mainData = {
			enquiryType: enquiryTypeSelector.options[enquiryTypeSelector.selectedIndex].text,
			name: form.querySelector('[name="fullName"]').value,
			email: form.querySelector('[name="email"]').value,
			phone: form.querySelector('[name="phoneNumber"]').value,
		};

		const extraData = (enquiryTypeSelector.value === 'sales')
			? { enquiry: form.querySelector('[name="enquiryNote"]').value } : {
				apartment: form.querySelector('[name="apartmentType"]').options[form.querySelector('[name="apartmentType"]').selectedIndex].text,
				profession: form.querySelector('[name="profession"]').value,
				company: form.querySelector('[name="company"]').value,
			};

		return Object.assign(mainData, extraData);
	};

	const resetContactFormEntries = form => {
		Array.from(form.querySelectorAll('[name]')).map(element => {
			element.value = '';
			return 1;
		});
		form.querySelector('[type="submit"]').value = 'Send';
	};

	const makePostRequest = ({ url, payload }) => {
		const requestPromise = new Request(url, {
			method: 'POST',
			mode: 'cors',
			headers: new Headers({
				'Content-Type': 'application/json',
			}),
			body: JSON.stringify(payload),
		});
		return requestPromise;
	};

	const animateButtonOnLoad = button => {
		const element = button;
		let buttonAnimationCounter = 0;
		const buttonLoadIntervalID = setInterval(() => {
			buttonAnimationCounter += 1;
			const dots = new Array(buttonAnimationCounter % 4).join('.');
			element.textContent = `Please wait.${dots}`;
		}, 450);
		return buttonLoadIntervalID;
	};

	const formIsLoading = form => {
		form.classList.add('c-form--is-submitting');
		return animateButtonOnLoad(form.querySelector('[type="submit"]'));
	};

	const formDoneLoading = form => {
		form.classList.remove('c-form--is-submitting');
		form.parentElement.classList.add('c-form--submitted');
		setTimeout(() => form.style.display = 'none', 300);
		resetContactFormEntries(form);
	};

	const addFormElement = (element, enteringClass, visibleClass, animationDuration = 300) => {
		element.classList.add(enteringClass, visibleClass);
		setTimeout(() => element.classList.remove(enteringClass), animationDuration);
	};

	const removeFormElement = (element, leavingClass, visibleClass, animationDuration = 300) => {
		element.classList.add(leavingClass);
		element.classList.remove(visibleClass);
		setTimeout(() => element.classList.remove(leavingClass), animationDuration);
	};

	const updateFormFields = (formCategory, formFields) => {
		Array.from(formFields)
			// .filter(element => )
			.map(formElementWrap => {
				const formElement = formElementWrap.querySelector('input') || formElementWrap.querySelector('select') || formElementWrap.querySelector('textarea');
				if (formElementWrap.getAttribute('data-category') === formCategory) {
					addFormElement(formElementWrap, 'u-animation--is-entering', 'u-animation--is-visible', 350);
					formElement.required = true;
					return;
				}
				removeFormElement(formElementWrap, 'u-animation--is-leaving', 'u-animation--is-visible', 350);
				formElement.required = false;
			});
	};

	document.querySelector('#enquiryType').addEventListener('change', function handleSelectChange(event) {
		event.preventDefault();
		const selectedDropdownValue = this.value;
		const optionalFormElements = document.querySelectorAll('.c-form__group[data-category]');
		updateFormFields(selectedDropdownValue, optionalFormElements);
	});

	document.getElementById('js-form').addEventListener('submit', function handleFormSubmit(event) {
		event.preventDefault();
		const FORM_API_URL = 'https://jacob-mews-form-submit.glitch.me';
		const currentForm = this;
		const payload = getContactFormData(currentForm);
		const loadingInstance = formIsLoading(currentForm);

		fetch(makePostRequest({ url: FORM_API_URL, payload }))
			.then(() => {
				setTimeout(() => {
					clearInterval(loadingInstance);
					formDoneLoading(currentForm);
				}, 500);
			})
			.catch(error => console.error(error));
	});
});
