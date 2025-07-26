<script lang="ts">
	import { iconMap, type IconName } from '$lib/types/iconMap';
	import { createEventDispatcher } from 'svelte';

	// Props interface
	interface IconProps {
		icon: IconName | null;
		className?: string;
		ariaLabel?: string;
		onPress?: (event: MouseEvent) => void;
	}

	// Props
	let { icon, className = '', ariaLabel = 'Icon', onPress }: IconProps = $props();

	// Event dispatcher for Svelte events
	const dispatch = createEventDispatcher();

	// Base classes
	const baseClasses = 'rounded-xl bg-transparent p-[9px] font-semibold shadow-sm';
	const themeClasses = 'flex items-center justify-center border-3 border-primary-700';

	// Combine classes function (equivalent to classNames utility)
	function combineClasses(...classes: (string | undefined | null | false)[]): string {
		return classes.filter(Boolean).join(' ');
	}

	// Handle click event
	function handleClick(event: MouseEvent): void {
		if (onPress) {
			onPress(event);
		}
		dispatch('press', event);
	}

	// Computed class names using $derived for Svelte 5 runes
	const buttonClassNames = $derived(combineClasses(baseClasses, themeClasses, className));
	const iconClassNames = $derived(combineClasses('size-5', className));
</script>

<button aria-label={ariaLabel} class={buttonClassNames} on:click={handleClick}>
	<!-- Icon component - you'll need to create or import your icon system -->
	<div class={iconClassNames}>
		{#if icon && iconMap[icon]}
			<svelte:component this={iconMap[icon]} size={20} strokeWidth={2} />
		{/if}
	</div>
</button>

<style>
	/* Add any component-specific styles here */
	button {
		transition: all 0.2s ease-in-out;
	}

	button:hover {
		transform: scale(1.05);
	}

	button:active {
		transform: scale(0.95);
	}
</style>
