import { redirect, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	if (!params.id) {
		throw error(400, 'Link ID is required');
	}

	const res = await fetch(`${env.PUBLIC_API_BASE_URL}/api/v1/info/${params.id}`);

	if (!res.ok) {
		throw error(res.status, 'Failed to fetch link info');
	}

	const data = await res.json();

	if (data && data.success && data.longUrl) {
		// ✅ Redirect immediately server-side
		throw redirect(307, data.longUrl);
	}

	throw error(404, 'Link not found');
};

export const prerender = false;
