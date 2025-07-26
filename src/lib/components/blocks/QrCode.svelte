<script lang="ts">
	import { QRCode } from '$lib';
	import toast from 'svelte-french-toast';
	import Button from '../ui/Button.svelte';
	import Input from '../ui/Input.svelte';
	import updateLinkInfo from '$lib/services/update-link';
	import { validateUrl } from '$lib/utils/siteCheckUrlValidation';

	let isLoading = $state(false);
	let isCopied = $state(false);
	let longUrlValue = $state('');
	let shortCode = $state(null);

	const downloadQRCode = () => {
		const qrCodeElement = document.querySelector('.qrcode') as HTMLImageElement;

		if (!qrCodeElement || !qrCodeElement.src) {
			toast.error('QR Code not found', {
				position: 'bottom-center'
			});
			return;
		}

		try {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			if (!ctx) {
				toast.error('Failed to create canvas context', {
					position: 'bottom-center'
				});
				return;
			}

			canvas.width = 200;
			canvas.height = 200;

			const img = new Image();
			img.crossOrigin = 'anonymous';

			img.onload = () => {
				ctx.drawImage(img, 0, 0);

				canvas.toBlob((blob) => {
					if (blob) {
						const downloadUrl = URL.createObjectURL(blob);
						const link = document.createElement('a');
						link.href = downloadUrl;
						link.download = `qr-code-${shortCode}.png`;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);

						URL.revokeObjectURL(downloadUrl);

						toast.success('QR Code downloaded successfully!', {
							position: 'bottom-center'
						});
					}
				}, 'image/png');
			};

			img.onerror = () => {
				toast.error('Failed to load QR Code image', {
					position: 'bottom-center'
				});
			};

			img.src = qrCodeElement.src;
		} catch (error) {
			toast.error('Failed to download QR Code', {
				position: 'bottom-center'
			});
		}
	};

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
			const errorMessage = err?.response?.message || err?.message || 'Fail to create QR code';
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
		class="relative mx-auto max-w-3xl rounded-4xl bg-white p-5 shadow sm:p-7 {isLoading
			? 'blur-sm'
			: ''}"
	>
		{#if shortCode === null}
			<!-- svelte-ignore event_directive_deprecated -->
			<form on:submit={handleSubmit}>
				<div class="flex flex-col gap-4 sm:flex-row">
					<div class="flex-1 pr-8 max-sm:pr-0 max-sm:pb-5">
						<div class="pb-14 text-start">
							<h1 class="block text-2xl leading-8 font-bold tracking-[-0.6%] text-neutral-950">
								Create a QR Code
							</h1>
							<p class="block text-base leading-8 font-normal tracking-[-0.6%] text-neutral-950">
								No credit card required.
							</p>
						</div>
						<div class="flex flex-col gap-4">
							<Input
								label="Enter your QR Code destination"
								placeholder="www.example.com/my-long-url"
								bind:value={longUrlValue}
								className="p-[14px] text-base"
							/>
							<div class="flex gap-4">
								<Button
									variant="primary"
									size="lg"
									className="px-6 py-3.5 text-lg font-semibold w-full sm:w-auto"
									afterLucideName="ArrowRight"
									type="submit"
								>
									Get QR Code
								</Button>
							</div>
						</div>
					</div>
					<div>
						<div class="mb-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4">
							<img src="/icons/qr-code-card-tall.png" alt="qr code" class="size-[242px]" />
						</div>
					</div>
				</div>
			</form>
		{:else}
			<div class="flex flex-col gap-4 sm:flex-row">
				<div class="flex-1 pr-8 max-sm:pr-0 max-sm:pb-5">
					<div class="pb-14 text-start">
						<h1 class="block text-2xl leading-8 font-bold tracking-[-0.6%] text-neutral-950">
							Your QR Code is ready 🥳
						</h1>
						<p class="block text-base leading-8 font-normal tracking-[-0.6%] text-neutral-950">
							Copy the QR Code below to share it
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
							<Button
								variant="primary"
								size="lg"
								className="px-6 py-3.5 text-lg font-semibold w-full sm:w-auto"
								afterLucideName="ArrowRight"
								on:click={() => (shortCode = null)}
							>
								Create new QR Code
							</Button>
						</div>
					</div>
				</div>
				<div>
					<div class="mb-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4">
						<QRCode
							value={`https://zilink.co/${shortCode}`}
							size={200}
							color="#000"
							background="#fff"
							errorCorrection="L"
							padding={0}
							className="qrcode"
						/>
					</div>
					<Button variant="primary" size="lg" className="w-full" on:click={downloadQRCode}>
						Download QR Code
					</Button>
				</div>
			</div>
		{/if}
	</div>
</div>
