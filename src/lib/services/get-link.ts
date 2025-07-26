import { env } from '$env/dynamic/public';

async function fetchLinkInfo(shortCode: string) {
	try {
		const response = await fetch(`${env.PUBLIC_API_BASE_URL}/api/v1/info/${shortCode}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error, 'error');
		throw error;
	}
}

export default fetchLinkInfo;
