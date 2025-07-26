<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { autogrow } from '$lib/utils/autogrow';

	export let id: string = '';
	export let type: 'text' | 'email' | 'password' | 'textarea' = 'text';
	export let placeholder: string = '';
	export let value: string = '';
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let ctrlKey: boolean = false;
	export let className: string = '';
	export let error: string = '';
	export let label: string = '';
	export let beforeIcon: string = '';
	export let afterIcon: string = '';

	export let beforeIconSize: number = 20;
	// export let afterIconSize: number = 23;

	type inputSize = 'xs' | 'sm' | 'lg' | 'xl' | 'default';
	export let size: inputSize = 'default';

	const sizeClasses = {
		xs: 'p-1.5 text-xs',
		sm: 'p-2 text-sm',
		lg: 'px-3 py-2 text-sm',
		xl: 'p-[14px] text-base',
		default: ' px-[10px] py-[9px] text-sm'
	}[size];

	export let onAfterIconClick: (() => void) | null = null;

	let inputRef: HTMLInputElement | null = null;
	let textareaRef: HTMLTextAreaElement | null = null;

	const dispatch = createEventDispatcher();

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || (event.ctrlKey && event.key === 'Enter')) {
			onAfterIconClick?.();
		}
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		dispatch('input', { value });
	}

	function handleTextarea(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
		dispatch('input', { value });
	}

	function handleShortcut(event: KeyboardEvent) {
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			inputRef?.focus();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleShortcut);
		return () => {
			window.removeEventListener('keydown', handleShortcut);
		};
	});

	$: inputClasses = twMerge(sizeClasses, className);
</script>

<div class="w-full">
	{#if label}
		<div class="mb-1 flex items-center space-x-2">
			<label for={id} class="block text-base leading-8 font-bold tracking-[-0.6%] text-neutral-950">
				{#if label.includes('*')}
					{label.split('*')[0]}<span class="text-error-500 pl-0.5">*</span>
				{:else}
					{label}
				{/if}
			</label>
		</div>
	{/if}

	<div
		class="search_input-full relative w-full focus:border-transparent focus:ring-0 focus:outline-none"
	>
		{#if beforeIcon}
			<img
				src={beforeIcon}
				alt="before icon"
				class="absolute top-1/2 left-3 -translate-y-1/2"
				width={beforeIconSize}
				height={beforeIconSize}
			/>
		{/if}

		{#if type === 'textarea'}
			<textarea
				{disabled}
				{required}
				bind:value
				{placeholder}
				{...id ? { id } : {}}
				on:keydown={handleKeyDown}
				on:input={handleTextarea}
				bind:this={textareaRef}
				class={`focus:border-primary-700 w-full resize-none overflow-hidden rounded-[10px] border-2 bg-white transition-all
    ${error ? 'border-error-500' : 'border-neutral-200'}
    ${beforeIcon ? 'pl-10' : ''}
    ${afterIcon ? 'pr-12' : ''}
			${inputClasses}`}
				aria-invalid={!!error}
				aria-describedby={error ? `${id}-error` : undefined}
				use:autogrow
			></textarea>
		{:else}
			<input
				{type}
				{disabled}
				{required}
				bind:value
				{placeholder}
				{...id ? { id } : {}}
				on:keydown={handleKeyDown}
				on:input={handleInput}
				bind:this={inputRef}
				class={`focus:border-primary-700 w-full rounded-[10px] border-3 bg-white transition-all
    ${error ? 'border-error-500' : 'border-neutral-200'}
    ${beforeIcon ? 'pl-10' : ''}
    ${afterIcon ? 'pr-12' : ''}
			${inputClasses}`}
				aria-invalid={!!error}
				aria-describedby={error ? `${id}-error` : undefined}
			/>{/if}

		{#if ctrlKey}
			<div class="absolute top-1/2 right-3 -translate-y-1/2">
				<img src={afterIcon} alt="h-full" aria-hidden="true" />
			</div>
		{:else if afterIcon}
			<button
				type="button"
				class="absolute top-1/2 {size === 'xl'
					? 'right-3 size-7'
					: 'right-5 size-5'} -translate-y-1/2"
				on:click={onAfterIconClick}
				aria-label="Click to perform action"
			>
				<img src={afterIcon} alt="" class="cursor-pointer" aria-hidden="true" />
			</button>
		{/if}
	</div>

	{#if error}
		<p id="{id}-error" class="text-error-500 input_error-g mt-0.5 text-xs" role="alert">
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M8.00016 14.6666C4.31826 14.6666 1.3335 11.6818 1.3335 7.99992C1.3335 4.31802 4.31826 1.33325 8.00016 1.33325C11.682 1.33325 14.6668 4.31802 14.6668 7.99992C14.6668 11.6818 11.682 14.6666 8.00016 14.6666ZM7.3335 7.33325V11.3333H8.66683V7.33325H7.3335ZM7.3335 4.66659V5.99992H8.66683V4.66659H7.3335Z"
					fill="#FB3748"
				/>
			</svg>
			{error}
		</p>
	{/if}
</div>
