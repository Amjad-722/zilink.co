export function autogrow(node: HTMLTextAreaElement) {
	function adjustHeight() {
		node.style.height = 'auto';
		node.style.height = `${node.scrollHeight}px`;
	}

	node.addEventListener('input', adjustHeight);
	adjustHeight(); // Initial adjustment

	return {
		destroy() {
			node.removeEventListener('input', adjustHeight);
		}
	};
}
