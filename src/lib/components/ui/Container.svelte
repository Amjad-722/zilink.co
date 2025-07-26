<script>
	let { children, className, size = 'default' } = $props();
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 {className}">
	{#if size === 'default'}
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 {className}">{children}</div>
	{:else if size === 'lg'}
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 {className}">{children}</div>
	{/if}
</div>
