import { env } from '$env/dynamic/public';

async function updateLinkInfo(data: Record<string, unknown>) {
	try {
		const response = await fetch(`${env.PUBLIC_API_BASE_URL}/api/v1/shorten`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result = await response.json();
		return result;
	} catch (error: unknown) {
		console.log(error, 'error');
		throw error;
	}
}

export default updateLinkInfo;
