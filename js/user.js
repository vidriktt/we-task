const fetchUserData = (userId) => {
	fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			const userDetails = document.getElementById('user-details').children;

			const userInfo = userDetails[0].children;
			userInfo[0].innerText = data.name;
			userInfo[1].children[1].innerText = data.username;
			userInfo[2].children[1].innerText = data.email;
			userInfo[2].children[1].href = `mailto:${data.email}`;
			userInfo[3].children[1].innerText = data.phone;
			userInfo[3].children[1].href = `tel:${data.phone}`;
			userInfo[4].children[1].innerText = data.website;
			userInfo[4].children[1].href = `http://${data.website}`;

			const addressInfo = userDetails[1].children;
			addressInfo[1].children[1].innerText = data.address.street;
			addressInfo[2].children[1].innerText = data.address.suite;
			addressInfo[3].children[1].innerText = data.address.city;
			addressInfo[4].children[1].innerText = data.address.zipcode;
			addressInfo[5].children[1].innerText = `${data.address.geo.lat}, ${data.address.geo.lng}`;
			addressInfo[5].children[1].href = `https://www.google.com/maps/place/${data.address.geo.lat},${data.address.geo.lng}`;

			const companyInfo = userDetails[2].children;
			companyInfo[1].children[1].innerText = data.company.name;
			companyInfo[2].children[1].innerText = data.company.catchPhrase;
			companyInfo[3].children[1].innerText = data.company.bs;

			document.title += ` - ${data.name}`;
		})
		.catch(error => {
			console.error(`Error when fetching user with id ${userId}: `, error);
		});
};

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

if (userId) {
	fetchUserData(userId);
}
