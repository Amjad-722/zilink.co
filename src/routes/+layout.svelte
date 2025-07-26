<script lang="ts">
	// import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';
	let { children } = $props();

	// async function detectSWUpdate() {
	// 	const registration = await navigator.serviceWorker.ready;

	// 	registration.addEventListener('updatefound', () => {
	// 		const newSW = registration.installing;

	// 		newSW?.addEventListener('statechange', () => {
	// 			if (newSW.state === 'installed') {
	// 				if (confirm('New update available! Reload to update?')) {
	// 					newSW.postMessage({ type: 'SKIP_WAITING' });
	// 					window.location.reload();
	// 				}
	// 			}
	// 		});
	// 	});
	// }

	// onMount(() => {
	// 	detectSWUpdate();
	// });
</script>

<!-- <svelte:head>
	<title>{'MB Smart Portal'}</title>
	<meta name="description" content={'created by MB Portal Team'} />
</svelte:head> -->

{@render children()}

<Toaster
	toastOptions={{
		style: 'border-radius: 10px; padding-left: 13px; padding-right: 6px;'
	}}
/>
