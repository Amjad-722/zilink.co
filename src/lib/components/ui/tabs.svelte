<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';
	import { iconMap } from '$lib/types/iconMap';
	import type { IconName } from '$lib/types/iconMap';

	type ComponentProps = {
		deviceId?: string;
		deviceInfo?: any;
		[key: string]: any;
	};

	interface TabItem {
		id: string;
		title: string;
		content: any;
		lucideName?: IconName | null;
		beforeActive: string | null;
		afterActive: string | null;
		props?: ComponentProps;
	}

	export let items: TabItem[] = [];
	export let initialActiveTabId: string | undefined = undefined;
	export let uniqueId: string = 'default';
	export let spaceTop: number = 6;
	export let spaceBottom: number = 6;
	const dispatch = createEventDispatcher();

	let activeTabId = writable(initialActiveTabId || (items.length > 0 ? items[0].id : ''));

	onMount(() => {
		if (browser && uniqueId) {
			const savedTabId = localStorage.getItem(`tab_${uniqueId}`);
			if (savedTabId && items.some((item) => item.id === savedTabId)) {
				activeTabId.set(savedTabId);
			}
		}
	});

	function selectTab(tabId: string) {
		activeTabId.set(tabId);
		dispatch('change', { tabId });

		if (browser && uniqueId) {
			localStorage.setItem(`tab_${uniqueId}`, tabId);
		}
	}
</script>

<div class="flex w-full items-center justify-center gap-2 overflow-x-auto whitespace-nowrap">
	{#each items as item}
		<button
			on:click={() => selectTab(item.id)}
			class={`inline-flex items-center rounded-2xl border-3 px-3 py-2.5 whitespace-nowrap ${$activeTabId === item.id ? 'border-primary-700 bg-white' : 'border-transparent'}`}
		>
			<div
				class="flex w-full items-center justify-start {(item.beforeActive && item.afterActive) ||
				item.lucideName
					? 'gap-2 pr-1'
					: ''}"
			>
				<!-- {#if item.lucideName}
					<svelte:component
						this={iconMap[item.lucideName]}
						size={25}
						strokeWidth={2}
						class={$activeTabId === item.id ? 'text-primary-700' : 'text-neutral-600'}
					/>
				{/if} -->
				{#if item.beforeActive && item.afterActive}
					<img
						src={$activeTabId === item.id ? item.afterActive : item.beforeActive}
						alt={item.title}
						class="size-8"
					/>
					<!-- {:else if !item.lucideName}
					<div class="h-5"></div> -->
				{/if}
				<span
					class="text-lg leading-5 font-bold tracking-[-0.6%] {$activeTabId === item.id
						? 'text-primary-700'
						: 'text-neutral-600'}"
				>
					{item.title}
				</span>
			</div>
		</button>
	{/each}
</div>

<!-- Tab Content -->
<div class="w-full pt-5">
	{#each items as item}
		{#if $activeTabId === item.id}
			<div class="pt-{spaceTop} pb-{spaceBottom}">
				<svelte:component this={item.content} {...item.props} />
			</div>
		{/if}
	{/each}
</div>
