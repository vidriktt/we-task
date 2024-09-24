const fetchUserData = (userId) => {
	fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			const userContainer = document.getElementById('user');

			userContainer.querySelector('h2').innerHTML = `${data.name}`;
			userContainer.querySelector('pre').innerHTML = JSON.stringify(data, null, 2);
		})
		.catch(error => {
			console.error(`Error when fetching user with id ${userId}: `, error);
		});
};

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

if (userId) {
	window.title += `${userId}`;
	fetchUserData(userId);
}
