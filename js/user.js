const storedUsers = JSON.parse(sessionStorage.getItem('we-users'));

const fetchUserData = (userId, callback) => {
	if (storedUsers) {
		callback(null, storedUsers[userId - 1]);
	} else {
		fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((data) => {
				callback(null, data);
			})
			.catch((error) => {
				console.error(
					`Error when fetching user with id ${userId}: `,
					error
				);
				callback(error, null);
			});
	}
};

const userDetails = document.getElementById('user-details').children;

const populateUserData = (userData) => {
	const userInfo = userDetails[0].children;
	userInfo[0].children[0].innerHTML = userData.name;
	userInfo[0].children[1].style.display = 'none';
	userInfo[0].children[1].children[0].value = userData.name;
	userInfo[1].children[1].children[0].value = userData.username;
	userInfo[2].children[1].children[0].value = userData.email;
	userInfo[3].children[1].children[0].value = userData.phone;
	userInfo[4].children[1].children[0].value = userData.website;

	const addressInfo = userDetails[1].children;
	addressInfo[1].children[1].children[0].value = userData.address.street;
	addressInfo[2].children[1].children[0].value = userData.address.suite;
	addressInfo[3].children[1].children[0].value = userData.address.city;
	addressInfo[4].children[1].children[0].value = userData.address.zipcode;
	addressInfo[5].children[1].children[0].value = `${userData.address.geo.lat}, ${userData.address.geo.lng}`;

	const companyInfo = userDetails[2].children;
	companyInfo[1].children[1].children[0].value = userData.company.name;
	companyInfo[2].children[1].children[0].value = userData.company.catchPhrase;
	companyInfo[3].children[1].children[0].value = userData.company.bs;

	toggleInputs(true);

	document.title += ` - ${userData.name}`;
};

const saveUserData = (userId) => {
	const updatedData = {
		id: userId
			? Number.parseInt(userId)
			: storedUsers[storedUsers.length - 1].id + 1 ||
				Math.floor(Math.random() * 99),
		name: userDetails[0].children[0].children[1].children[0].value,
		username: userDetails[0].children[1].children[1].children[0].value,
		email: userDetails[0].children[2].children[1].children[0].value,
		phone: userDetails[0].children[3].children[1].children[0].value,
		website: userDetails[0].children[4].children[1].children[0].value,
		address: {
			street: userDetails[1].children[1].children[1].children[0].value,
			suite: userDetails[1].children[2].children[1].children[0].value,
			city: userDetails[1].children[3].children[1].children[0].value,
			zipcode: userDetails[1].children[4].children[1].children[0].value,
			geo: {
				lat: userDetails[1].children[5].children[1].children[0].value
					.split(',')[0]
					.trim(),
				lng: userDetails[1].children[5].children[1].children[0].value
					.split(',')[1]
					.trim(),
			},
		},
		company: {
			name: userDetails[2].children[1].children[1].children[0].value,
			catchPhrase:
				userDetails[2].children[2].children[1].children[0].value,
			bs: userDetails[2].children[3].children[1].children[0].value,
		},
	};

	if (userId) {
		const updatedUsers = storedUsers.map((user) =>
			user.id === updatedData.id ? updatedData : user
		);
		sessionStorage.setItem('we-users', JSON.stringify(updatedUsers));
	} else {
		sessionStorage.setItem(
			'we-users',
			JSON.stringify([...storedUsers, updatedData])
		);
		window.location.href = `user.html?id=${updatedData.id}`;
	}
};

const toggleButtons = (editing) => {
	if (editing) {
		editBtn.style.display = 'none';
		saveBtn.style.display = 'block';
		cancelBtn.style.display = 'block';
		deleteBtn.style.display = 'block';
	} else {
		editBtn.style.display = 'block';
		saveBtn.style.display = 'none';
		cancelBtn.style.display = 'none';
		deleteBtn.style.display = 'none';
	}
};

const toggleInputs = (disabled) => {
	const inputs = document.querySelectorAll(
		'#user-details input, #user-details textarea'
	);
	inputs.forEach((input) =>
		disabled
			? input.setAttribute('disabled', 'disabled')
			: input.removeAttribute('disabled')
	);
};

const areInputsValid = () => {
	let inputsValid = true;
	const inputs = document.querySelectorAll(
		'#user-details input, #user-details textarea'
	);

	inputs.forEach((input) => {
		if (input.value.trim() === '') {
			inputsValid = false;
			input.classList.add('border-red-500');
		} else {
			input.classList.remove('border-red-500');
		}
	});

	return inputsValid;
};

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');
let user = {};

const editBtn = document.getElementById('user-edit-btn');
const saveBtn = document.getElementById('user-save-btn');
const cancelBtn = document.getElementById('user-cancel-btn');
const deleteBtn = document.getElementById('user-delete-btn');
const errMsg = document.getElementById('validation-err-msg');

if (userId) {
	fetchUserData(userId, (error, userData) => {
		if (error) {
			console.error('Failed to fetch user data: ', error);
		} else {
			user = userData;
			populateUserData(user);
			toggleButtons();
		}
	});
} else {
	deleteBtn.style.display = 'none';
}

editBtn.addEventListener('click', () => {
	toggleButtons(true);
	toggleInputs();
});

saveBtn.addEventListener('click', () => {
	if (!areInputsValid()) {
		errMsg.style.display = 'block';
		return;
	}

	saveUserData(userId && userId);
	toggleButtons();
	toggleInputs(true);
});

cancelBtn.addEventListener('click', () => {
	if (!userId) {
		window.location.href = 'index.html';
	}

	errMsg.style.display = 'none';
	userId && populateUserData(user);
	toggleButtons();
});

deleteBtn.addEventListener('click', () => {
	sessionStorage.setItem(
		'we-users',
		JSON.stringify(
			storedUsers.filter((user) => user.id !== Number.parseInt(userId))
		)
	);
	window.location.href = 'index.html';
});
