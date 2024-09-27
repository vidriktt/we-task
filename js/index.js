const tableBody = document.getElementById('users-table').querySelector('tbody');

const fetchUsers = (callback) => {
	const loader = document.getElementById('loader');
	loader.classList.remove('hidden');

	const storedUsers = sessionStorage.getItem('we-users');

	if (storedUsers) {
		loader.classList.add('hidden');
		callback(null, JSON.parse(storedUsers));
	} else {
		fetch('https://jsonplaceholder.typicode.com/users')
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((data) => {
				sessionStorage.setItem('we-users', JSON.stringify(data));
				loader.classList.add('hidden');
				callback(null, data);
			})
			.catch((error) => {
				loader.classList.add('hidden');
				console.error('Error when fetching users: ', error);
				callback(error, null);
			});
	}
};

const populateUsersTable = (users) => {
	tableBody.innerHTML = '';

	users.forEach((user) => {
		const row = document.createElement('tr');

		row.classList.add(
			...[
				'cursor-pointer',
				'border-t',
				'hover:bg-gray-50',
				'hover:transition',
				'hover:duration-100',
			]
		);

		row.id = `user-${user.id}`;
		row.innerHTML = `
					<td class="p-2">${user.id}</td>
					<td class="p-2">${user.name}</td>
					<td class="p-2">${user.username}</td>
				`;

		row.addEventListener('click', () => {
			window.location.href = `user.html?id=${user.id}`;
		});

		tableBody.appendChild(row);
	});
};

const searchByName = () => {
	const searchValue = document.getElementById('search').value.toLowerCase();

	tableBody.querySelectorAll('tr').forEach((row) => {
		const name = row
			.querySelector('td:nth-child(2)')
			.textContent.toLowerCase();
		const username = row
			.querySelector('td:nth-child(3)')
			.textContent.toLowerCase();

		if (name.includes(searchValue) || username.includes(searchValue)) {
			row.style.display = '';
		} else {
			row.style.display = 'none';
		}
	});
};

let users = [];

fetchUsers((error, data) => {
	if (error) {
		console.error('Error when fetching users: ', error);
	} else {
		users = data;
		populateUsersTable(users);
	}
});

document.getElementById('search').addEventListener('keyup', searchByName);
