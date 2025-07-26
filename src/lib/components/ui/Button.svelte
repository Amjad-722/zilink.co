<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { iconMap } from '$lib/types/iconMap';
	import type { IconName } from '$lib/types/iconMap';

	type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
	type ButtonType = 'button' | 'submit' | 'reset';
	type ButtonVariant =
		| 'primary'
		| 'secondary'
		| 'outline'
		| 'danger'
		| 'warning'
		| 'text'
		| 'light'
		| 'lightDanger'
		| 'default';

	export let collapsable: boolean = false;
	export let beforeLucideName: IconName | null = null;
	export let afterLucideName: IconName | null = null;
	export let size: ButtonSize = 'md';
	export let variant: ButtonVariant = 'default';
	export let type: ButtonType = 'button';
	export let disabled: boolean = false;
	export let beforeIcon: string | null = null;
	export let afterIcon: string | null = null;
	export let className: string = '';
	export let beforeIconSize: number = 20;
	export let afterIconSize: number = 23;
	export let gap: number = 2;

	const baseClasses = `flex items-center gap-${gap} rounded-[10px] transition duration-200`;

	$: btnClasses = {
		default: 'sms-orange-btn border-2 border-neutral-200 bg-neutral',
		// primary: 'bg-primary-700 text-white hover:bg-primary-600 customer_btn-j',
		primary: 'bg-primary-700 outline-dashed text-white hover:bg-primary-900 customer_btn-j',
		secondary: 'bg-success-500 text-white hover:bg-success-600',
		// outline: 'border-2 border-neutral-200 text-neutral-600 hover:bg-neutral-50 reload_btn-height',
		outline:
			'border-2 border-neutral-200 text-neutral-600 hover:bg-neutral-50 reload_btn-height bg-white',
		success: 'bg-success-600 border-2 border-neutral-200 text-neutral-600 hover:bg-success-700',
		danger: 'bg-error-500 text-white hover:bg-error-600',
		warning: 'bg-orange-500 text-white hover:bg-orange-600',
		text: 'bg-transparent text-purple-600 hover:bg-purple-50',
		light: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
		lightDanger: 'bg-warning-50 text-warning-500 hover:bg-warning-100'
	}[variant];

	$: sizeClasses = {
		xs: 'p-[6px] font-medium leading-5 tracking-[-0.6%] text-sm',
		sm: 'p-[8px] font-medium leading-5 tracking-[-0.6%] text-sm',
		md: 'p-[10px] font-medium leading-5 tracking-[-0.6%] text-sm',
		lg: 'px-[12px] py-2.5 leading-5 tracking-[-0.6%] text-sm',
		xl: 'px-6 py-4 text-xl',
		full: 'w-full py-2.5 text-lg'
	}[size];

	$: buttonClasses = twMerge(
		baseClasses,
		btnClasses,
		sizeClasses,
		disabled ? 'cursor-not-allowed opacity-50' : '',
		className ? `${className} justify-between` : 'justify-center'
	);
</script>

<button
	class={`${buttonClasses} whitespace-nowrap`}
	{disabled}
	{type}
	on:click
	on:mouseover
	on:mouseenter
	on:mouseleave
	{...$$restProps}
>
	{#if beforeLucideName}
		<svelte:component this={iconMap[beforeLucideName]} size={beforeIconSize} strokeWidth={2} />
	{/if}
	{#if beforeIcon}
		<img src={beforeIcon} alt="Before Icon" width={beforeIconSize} height={beforeIconSize} />
	{/if}
	<span class={collapsable === true ? 'hidden md:inline-block' : ''}>
		<slot />
	</span>
	{#if afterLucideName}
		<svelte:component this={iconMap[afterLucideName]} size={afterIconSize} strokeWidth={2} />
	{/if}
	{#if afterIcon}
		<div class={`add-site-arrow`}>
			<img src={afterIcon} alt="After Icon" width={afterIconSize} height={afterIconSize} />
		</div>
	{/if}
</button>
