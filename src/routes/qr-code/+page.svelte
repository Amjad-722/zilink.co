<script lang="ts">
	import { QRCode } from '$lib';

	let qrValue = 'https://example.com';
	let qrSize = 200;
	let qrColor = '#000';
	let qrBackground = '#ffffff';
	let qrErrorCorrection: 'L' | 'M' | 'Q' | 'H' = 'L';
	let qrPadding = 20;
	let qrClassName = 'border rounded shadow-lg';

	// Example values for quick testing
	const examples = [
		{ name: 'Website', value: 'https://www.google.com' },
		{ name: 'Email', value: 'mailto:test@example.com' },
		{ name: 'Phone', value: 'tel:+1234567890' },
		{ name: 'Text', value: 'Hello World! This is a test QR code.' },
		{ name: 'WiFi', value: 'WIFI:S:MyWiFi;T:WPA;P:password123;;' },
		{ name: 'Bitcoin', value: 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' }
	];

	function setExample(example: { name: string; value: string }) {
		qrValue = example.value;
	}
</script>

<svelte:head>
	<title>QR Code Generator - MB Smart</title>
	<meta name="description" content="Generate QR codes for URLs, text, and more" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
	<div class="container mx-auto max-w-6xl px-4">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-gray-900">QR Code Generator</h1>
			<p class="mx-auto max-w-2xl text-xl text-gray-600">
				Generate custom QR codes for URLs, text, contact information, and more. Perfect for sharing
				links, contact details, or any text-based information.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Controls Panel -->
			<div class="lg:col-span-1">
				<div class="sticky top-8 rounded-xl bg-white p-6 shadow-lg">
					<h2 class="mb-6 text-2xl font-semibold text-gray-900">Customize QR Code</h2>

					<div class="space-y-6">
						<!-- Value Input -->
						<div>
							<label for="value" class="mb-2 block text-sm font-medium text-gray-700">
								Content to Encode *
							</label>
							<textarea
								id="value"
								bind:value={qrValue}
								rows="3"
								class="w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
								placeholder="Enter URL, text, or any content to encode..."
							></textarea>
						</div>

						<!-- Quick Examples -->
						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700"> Quick Examples </label>
							<div class="grid grid-cols-2 gap-2">
								{#each examples as example}
									<button
										on:click={() => setExample(example)}
										class="rounded border bg-gray-100 p-2 text-xs transition-colors hover:bg-gray-200"
									>
										{example.name}
									</button>
								{/each}
							</div>
						</div>

						<!-- Size Control -->
						<div>
							<label for="size" class="mb-2 block text-sm font-medium text-gray-700">
								Size: {qrSize}px
							</label>
							<input
								id="size"
								type="range"
								min="100"
								max="400"
								step="10"
								bind:value={qrSize}
								class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
							/>
							<div class="mt-1 flex justify-between text-xs text-gray-500">
								<span>100px</span>
								<span>400px</span>
							</div>
						</div>

						<!-- Color Controls -->
						<div class="grid grid-cols-2 gap-4">
							<div>
								<label for="color" class="mb-2 block text-sm font-medium text-gray-700">
									QR Code Color
								</label>
								<input
									id="color"
									type="color"
									bind:value={qrColor}
									class="h-10 w-full cursor-pointer rounded-lg border border-gray-300"
								/>
							</div>
							<div>
								<label for="background" class="mb-2 block text-sm font-medium text-gray-700">
									Background Color
								</label>
								<input
									id="background"
									type="color"
									bind:value={qrBackground}
									class="h-10 w-full cursor-pointer rounded-lg border border-gray-300"
								/>
							</div>
						</div>

						<!-- Error Correction -->
						<div>
							<label for="errorCorrection" class="mb-2 block text-sm font-medium text-gray-700">
								Error Correction Level
							</label>
							<select
								id="errorCorrection"
								bind:value={qrErrorCorrection}
								class="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							>
								<option value="L">Low (7%) - Smallest size</option>
								<option value="M">Medium (15%) - Good balance</option>
								<option value="Q">Quartile (25%) - Better reliability</option>
								<option value="H">High (30%) - Maximum reliability</option>
							</select>
						</div>

						<!-- Padding -->
						<div>
							<label for="padding" class="mb-2 block text-sm font-medium text-gray-700">
								Padding: {qrPadding}px
							</label>
							<input
								id="padding"
								type="range"
								min="0"
								max="20"
								step="1"
								bind:value={qrPadding}
								class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
							/>
							<div class="mt-1 flex justify-between text-xs text-gray-500">
								<span>0px</span>
								<span>20px</span>
							</div>
						</div>

						<!-- CSS Class -->
						<div>
							<label for="className" class="mb-2 block text-sm font-medium text-gray-700">
								CSS Classes
							</label>
							<input
								id="className"
								type="text"
								bind:value={qrClassName}
								class="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
								placeholder="border rounded shadow-lg"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- QR Code Display -->
			<div class="lg:col-span-2">
				<div class="rounded-xl bg-white p-8 shadow-lg">
					<h2 class="mb-6 text-2xl font-semibold text-gray-900">Generated QR Code</h2>

					<div class="flex flex-col items-center space-y-6">
						<!-- QR Code -->
						<div
							class="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8"
						>
							<QRCode
								value={qrValue}
								size={qrSize}
								color={qrColor}
								background={qrBackground}
								errorCorrection={qrErrorCorrection}
								padding={qrPadding}
								className={qrClassName}
							/>
						</div>

						<!-- Current Settings -->
						<div class="w-full max-w-md">
							<h3 class="mb-3 text-lg font-medium text-gray-900">Current Settings</h3>
							<div class="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
								<div class="flex justify-between">
									<span class="text-gray-600">Content:</span>
									<span
										class="max-w-[200px] truncate font-mono text-xs text-gray-900"
										title={qrValue}
									>
										{qrValue || 'None'}
									</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Size:</span>
									<span class="text-gray-900">{qrSize}px</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Color:</span>
									<span class="text-gray-900">{qrColor}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Background:</span>
									<span class="text-gray-900">{qrBackground}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Error Correction:</span>
									<span class="text-gray-900">{qrErrorCorrection}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Padding:</span>
									<span class="text-gray-900">{qrPadding}px</span>
								</div>
							</div>
						</div>

						<!-- Instructions -->
						<div class="w-full max-w-md text-center">
							<p class="text-sm text-gray-600">
								Right-click on the QR code to save it as an image, or scan it with your phone's
								camera to test the content.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-12 text-center text-gray-500">
			<p>QR codes generated using the MB Smart QR Code component</p>
		</div>
	</div>
</div>
