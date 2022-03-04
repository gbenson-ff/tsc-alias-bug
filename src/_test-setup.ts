Object.defineProperty(window, 'CSS', { value: null });

Object.defineProperty(document, 'doctype', {
	value: '<!DOCTYPE html>'
});

Object.defineProperty(window, 'getComputedStyle', {
	value: () => ({
		display: 'none',
		appearance: ['-webkit-appearance'],
		getPropertyValue: (prop: string): string => prop
	})
});

Object.defineProperty(window, 'location', {
	writable: true,
	value: () => ({
		href: ''
	})
});

Object.defineProperty(window, 'matchMedia', {
	value: () => ({ matches: false, media: '' }),
	writable: true
});

Object.defineProperty(document.body.style, 'transform', {
	value: () => ({
		enumerable: true,
		configurable: true
	})
});
