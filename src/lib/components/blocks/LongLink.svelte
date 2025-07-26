<script lang="ts">
	import toast from 'svelte-french-toast';
	import Input from '../ui/Input.svelte';
	import Button from '../ui/Button.svelte';
	import updateLinkInfo from '$lib/services/update-link';
	import { validateUrl } from '$lib/utils/siteCheckUrlValidation';

	let isLoading = $state(false);
	let isCopied = $state(false);
	let longUrlValue = $state('');
	let shortCode = $state(null);

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		if (!validateUrl(longUrlValue)) {
			return;
		}

		try {
			isLoading = true;
			const response = await updateLinkInfo({
				longUrl: longUrlValue
			});

			shortCode = response.data.shortCode;

			longUrlValue = '';
		} catch (err: any) {
			const errorMessage = err?.response?.message || err?.message || 'Fail to create short link';
			toast.error(errorMessage, {
				position: 'bottom-center'
			});
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="relative">
	{#if isLoading}
		<div class="absolute inset-0 z-50 flex items-center justify-center">
			<img src="/icons/svg/loader.svg" alt="loader" class="size-8 animate-spin" />
		</div>
	{/if}
	<div
		class="relative mx-auto max-w-3xl rounded-4xl bg-white p-5 shadow max-sm:pb-6 sm:p-7 {isLoading
			? 'blur-sm'
			: ''}"
	>
		{#if shortCode === null}
			<!-- svelte-ignore event_directive_deprecated -->
			<form on:submit={handleSubmit}>
				<div class="pb-14 text-start">
					<h1 class="block text-2xl leading-8 font-bold tracking-[-0.6%] text-neutral-950">
						Shorten a long link
					</h1>
					<p class="block text-base leading-8 font-normal tracking-[-0.6%] text-neutral-950">
						No credit card required.
					</p>
				</div>
				<div class="flex flex-col gap-4">
					<Input
						label="Paste your long link here"
						placeholder="www.example.com/my-long-url"
						bind:value={longUrlValue}
						className="p-[14px] text-base"
					/>
					<div class="flex gap-4">
						<Button
							variant="primary"
							type="submit"
							size="lg"
							className="px-6 py-3.5 text-lg font-semibold w-full sm:w-auto"
							afterLucideName="ArrowRight"
						>
							Get short link
						</Button>
					</div>
				</div>
			</form>
		{:else}
			<div>
				<div class="pb-14 text-start">
					<h1 class="block text-2xl leading-8 font-bold tracking-[-0.6%] text-neutral-950">
						Your link is ready 🥳
					</h1>
					<p class="block text-base leading-8 font-normal tracking-[-0.6%] text-neutral-950">
						Copy the link below to share it or choose a platform to share it to.
					</p>
				</div>
				<div class="flex flex-col gap-4">
					<Input
						label="Copied link to clipboard"
						value={`https://zilink.co/${shortCode}`}
						disabled={true}
						size="xl"
						afterIcon={isCopied ? '/icons/svg/copy-check.svg' : '/icons/svg/copy.svg'}
						onAfterIconClick={() => {
							navigator.clipboard.writeText(`https://zilink.co/${shortCode}`);
							isCopied = true;
							setTimeout(() => {
								isCopied = false;
							}, 2000);
						}}
					/>
					<div class="flex gap-4">
						<!-- <Button
							variant="warning"
							size="lg"
							className="px-6 py-3.5 text-lg font-semibold"
							beforeLucideName="ChartColumnStacked"
						>
							View link analytics
						</Button> -->
						<Button
							variant="primary"
							size="lg"
							className="px-6 py-3.5 text-lg font-semibold w-full sm:w-auto"
							afterLucideName="ArrowRight"
							on:click={() => (shortCode = null)}
						>
							Create new link
						</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
