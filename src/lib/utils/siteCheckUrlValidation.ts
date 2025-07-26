import toast from 'svelte-french-toast';

export function validateUrl(url: string): boolean {
	const trimmedValue = url.trim();
	const message = 'Please enter a valid URL format' as string;

	if (!trimmedValue) {
		toast.error(message, { position: 'bottom-center' });
		return false;
	}

	try {
		const urlToTest =
			trimmedValue.startsWith('http://') || trimmedValue.startsWith('https://')
				? trimmedValue
				: `https://${trimmedValue}`;

		new URL(urlToTest);
		return true;
	} catch {
		toast.error(message, {
			position: 'bottom-center'
		});
		return false;
	}
}
