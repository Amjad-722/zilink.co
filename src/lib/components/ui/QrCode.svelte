<script lang="ts">
	import { onMount } from 'svelte';
	import QRious from 'qrious';

	export let errorCorrection: 'L' | 'M' | 'Q' | 'H' = 'L';
	export let background = '#fff';
	export let color = '#000';
	export let size = 200;
	export let value = '';
	export let padding = 0;
	export let className = 'qrcode';

	let image = '';
	let QRcode: QRious | null = null;
	let error = '';

	function generateQrCode() {
		if (!QRcode || !value) return;

		try {
			QRcode.set({
				background,
				foreground: color,
				level: errorCorrection,
				padding,
				size,
				value
			});

			image = QRcode.toDataURL('image/jpeg');
			error = '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to generate QR code';
			console.error('QR Code generation error:', err);
		}
	}

	export function getImage(): string {
		return image;
	}

	export function getError(): string {
		return error;
	}

	onMount(() => {
		try {
			QRcode = new QRious();
			if (value) {
				generateQrCode();
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to initialize QR code library';
			console.error('QR Code initialization error:', err);
		}
	});

	// Reactive statement to regenerate QR code when dependencies change
	$: if (value && QRcode && (errorCorrection || background || color || size || padding)) {
		generateQrCode();
	}
</script>

{#if error}
	<div class="error text-sm text-red-500">{error}</div>
{:else if image}
	<img src={image} alt="QR Code for {value}" class={className} />
{:else}
	<div class="placeholder text-sm text-gray-400">No QR code generated</div>
{/if}
