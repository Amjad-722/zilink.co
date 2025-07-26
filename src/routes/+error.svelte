<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
</script>

<div class="flex h-screen flex-col items-center justify-center bg-neutral-100 text-center">
	<h1 class="text-primary-700 text-6xl font-bold">404</h1>
	<h2 class="mt-2 text-2xl font-semibold text-gray-700">Oops! Page Not Found</h2>
	<p class="mt-2 text-neutral-500">The page you're looking for doesn't exist.</p>

	<Button
		lucideName="LayoutDashboard"
		className="mt-5"
		variant="primary"
		size="md"
		on:click={() => goto('/')}
	>
		Go to Home
	</Button>
</div>
