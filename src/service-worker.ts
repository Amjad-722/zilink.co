/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

console.log({ build, files, version });

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

// install service worker
self.addEventListener('install', (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}
	event.waitUntil(addFilesToCache());
});

// activate service worker
self.addEventListener('activate', (event) => {
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) {
				await caches.delete(key);
			}
		}
	}

	event.waitUntil(deleteOldCaches());
});

// Listen to fetch events
self.addEventListener('fetch', (event) => {
	// Only handle GET requests
	if (event.request.method !== 'GET') return;

	// Skip chrome-extension and other unsupported protocols
	const url = new URL(event.request.url);
	if (
		url.protocol === 'chrome-extension:' ||
		url.protocol === 'chrome:' ||
		url.protocol === 'moz-extension:'
	) {
		return;
	}

	async function respond() {
		const cache = await caches.open(CACHE);

		// serve build files from the cache
		if (ASSETS.includes(url.pathname)) {
			const cachedReponse = await cache.match(url.pathname);
			if (cachedReponse) {
				return cachedReponse;
			}
		}

		// Try the network first
		try {
			const response = await fetch(event.request);
			const isSuccess = response.status === 200;
			const isCacheable = url.protocol === 'http:' || url.protocol === 'https:';

			// Only cache successful responses from HTTP/HTTPS protocols
			if (isCacheable && isSuccess) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (error) {
			console.warn('Service worker fetch failed:', error);
			// fall back to cache
			const cachedResponse = await cache.match(url.pathname);
			if (cachedResponse) {
				return cachedResponse;
			}
		}

		return new Response('Not found', { status: 404 });
	}

	event.respondWith(respond());
});

// self.addEventListener('message', (event) => {
// 	if (event.data && event.data.type === 'SKIP_WAITING') {
// 		self.skipWaiting();
// 		console.log('skip waiting');
// 	}
// });
