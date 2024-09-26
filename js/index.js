const tableBody = document.getElementById('users-table').querySelector('tbody');

document.addEventListener('DOMContentLoaded', () => {
	fetch('https://jsonplaceholder.typicode.com/users')
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then((data) => {
			data.forEach((user) => {
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
		})
		.catch((error) => {
			console.error('Error when fetching users: ', error);
		});
});

document.getElementById('search').addEventListener('keyup', searchByName);

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
