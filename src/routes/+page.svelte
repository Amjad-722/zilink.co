<script>
	import LongLink from '$lib/components/blocks/LongLink.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import LngModal from '$lib/components/ui/lng-modal.svelte';
	import QrCode from '$lib/components/blocks/QrCode.svelte';
	import Tabs from '$lib/components/ui/tabs.svelte';
	import Translation from '$lib/components/ui/translation.svelte';

	const AndroidTabs = [
		{
			id: '9191',
			title: 'Short link',
			content: LongLink,
			beforeActive: '/icons/svg/links.svg',
			afterActive: '/icons/svg/links.svg',
			props: { deviceId: '9191' }
		},
		{
			id: '9292',
			title: 'QR Code',
			content: QrCode,
			beforeActive: '/icons/svg/qr-codes.svg',
			afterActive: '/icons/svg/qr-codes.svg',
			props: { deviceId: '9292' }
		}
	];

	let showModal = $state(false);
</script>

<svelte:head>
	<title>Create Shorten links | zilink.co</title>
	<meta
		name="description"
		content="Use our URL shortener and QR codes to connect your audience with the right content Track every click and interaction with the zilink.co Platform"
	/>
</svelte:head>

<LngModal bind:showModal>
	<Translation />
</LngModal>

<header class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
	<div class="flex items-center justify-between">
		<h1 class="text-[22px] font-bold text-neutral-950 sm:text-2xl">Zilink.co</h1>
		<div class="flex items-center gap-4">
			<Icon icon="GlobeIcon" ariaLabel="GlobeIcon" onPress={() => (showModal = true)} />
		</div>
	</div>
</header>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
	<!-- Hero Section -->
	<section class="relative min-h-screen">
		<div class="from-primary-600/10 to-primary-800/10 absolute inset-0 bg-gradient-to-r"></div>
		<div class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
			<div class="text-center">
				<h1 class="mb-2 text-3xl leading-tight font-bold text-gray-900 md:text-6xl">
					Create Shorten links
					<!-- Shorten Links, Create QR Codes & Track Clicks | Zilink -->
				</h1>
				<p class="mx-auto mb-8 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-xl">
					Use our URL shortener and QR codes to connect your audience with the right content Track
					every click and interaction with the <span class="font-bold underline underline-offset-4"
						>zilink.co</span
					> Platform
				</p>
				<Tabs items={AndroidTabs} uniqueId={`device_tabs_${Math.floor(Math.random() * 1000000)}`} />
			</div>
		</div>
	</section>
</div>
