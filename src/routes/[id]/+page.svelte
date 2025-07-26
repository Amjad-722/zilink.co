<!-- <script lang="ts">
	import { onMount } from 'svelte';
	import fetchLinkInfo from '$lib/services/get-link.js';

	let { data } = $props();
	const shortCode = data.paramId;

	onMount(async () => {
		try {
			const response = await fetchLinkInfo(shortCode);

			if (response && response.success && response.longUrl) {
				// ✅ Redirect to the original long URL
				window.location.href = response.longUrl;
			} else {
				console.log(response, 'logs response');
			}
		} catch (err) {
			console.error('Error while redirecting:', err);
		}
	});
</script>

<div></div> -->
