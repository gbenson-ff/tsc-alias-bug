import faker from '@faker-js/faker';
import { Storage } from '~/models/storage.model';
import { StorageType } from '~/models/storage-type.model';

const { PREFIX_KEY_SEPARATOR } = Storage;
const NUM_RECORDS_FOR_CLEAR_TESTS = 3;

// eslint-disable-next-line max-lines-per-function
describe('storage.model', () => {
	/* eslint-disable @typescript-eslint/init-declarations */
	let key: string;
	let prefixedKey: string;
	let record: Record<string, unknown>;
	let prefix: string;
	let storage: Storage;
	/* eslint-enable @typescript-eslint/init-declarations */

	// Setup
	beforeEach(() => {
		// Randomize the prefix
		prefix = faker.lorem.word();

		// Randomize the key
		key = faker.lorem.word();

		// Randomize the record
		record = JSON.parse(faker.datatype.json()) as Record<string, unknown>;

		// Set the prefixedKey.  This has to come after assigning prefix and key or
		// you'll make the same mistake I did :-\
		prefixedKey = [prefix, key].join(PREFIX_KEY_SEPARATOR);
	});

	describe('Default storage type', () => {
		beforeEach(() => {
			storage = new Storage(prefix);
		});

		test('Defaults to session storage', () => {
			sessionStorage.setItem(prefixedKey, JSON.stringify(record));

			const actual = storage.get(key);

			expect(actual).toStrictEqual(record);
		});
	});

	describe('Local storage', () => {
		beforeEach(() => {
			storage = new Storage(prefix, StorageType.LOCAL);
		});

		test('get', () => {
			localStorage.setItem(prefixedKey, JSON.stringify(record));

			const actual = storage.get(key);

			expect(actual).toStrictEqual(record);
		});

		test('set', () => {
			storage.set(key, record);

			const stored = localStorage.getItem(prefixedKey) as string;

			expect(stored).not.toBeNull();

			const actual = JSON.parse(stored) as typeof record;

			expect(actual).toStrictEqual(record);
		});

		test('clear', () => {
			// First, create and set an item into localStorage directly.  We want to
			// test that calling clear on our instance of storage only clears the
			// items set by said instance.  We set this value directly and will later
			// check to see if it's still present after calling clear on our storage
			// instance.
			const externalKey = faker.lorem.word();
			const externalValue: unknown = JSON.parse(faker.datatype.json());
			localStorage.setItem(externalKey, JSON.stringify(externalValue));

			// Create some keys
			const keys = new Array(NUM_RECORDS_FOR_CLEAR_TESTS)
				.fill(null)
				.map(() => faker.lorem.word());

			// And some records
			const records = new Array(NUM_RECORDS_FOR_CLEAR_TESTS)
				.fill(null)
				.map(() => JSON.parse(faker.datatype.json()) as Record<string, unknown>);

			// Then loop through the keys and insert the records into storage
			keys
				.forEach((randomKey, index) => {
					prefixedKey = [prefix, randomKey].join(PREFIX_KEY_SEPARATOR);
					record = records[index];

					storage.set(prefixedKey, record);
				});

			// Call clear
			storage.clear();

			// Now loop through keys again, and assert that each have no associated
			// value.
			keys
				.forEach(randomKey => {
					prefixedKey = [prefix, randomKey].join(PREFIX_KEY_SEPARATOR);
					const actual = sessionStorage.getItem(prefixedKey);

					expect(actual).toBeNull();
				});

			// Lastly, check that our external (directly-written) item is still
			// present.
			const storedExternalValue = localStorage.getItem(externalKey) as string;

			expect(storedExternalValue).not.toBeNull();

			const parsedStoredExternalValue: unknown = JSON.parse(storedExternalValue);

			expect(parsedStoredExternalValue).toStrictEqual(externalValue);
		});

		test('delete', () => {
			localStorage.setItem(prefixedKey, JSON.stringify(record));

			storage.delete(key);

			const actual = localStorage.getItem(prefixedKey);

			expect(actual).toBeNull();
		});
	});

	describe('Session storage', () => {
		beforeEach(() => {
			storage = new Storage(prefix, StorageType.SESSION);
		});

		test('get', () => {
			sessionStorage.setItem(prefixedKey, JSON.stringify(record));

			const actual = storage.get(key);

			expect(actual).toStrictEqual(record);
		});

		test('set', () => {
			storage.set(key, record);

			const stored = sessionStorage.getItem(prefixedKey) as string;

			expect(stored).not.toBeNull();

			const actual = JSON.parse(stored) as typeof record;

			expect(actual).toStrictEqual(record);
		});

		test('clear', () => {
			// First, create and set an item into sessionStorage directly.  We want to
			// test that calling clear on our instance of storage only clears the
			// items set by said instance.  We set this value directly and will later
			// check to see if it's still present after calling clear on our storage
			// instance.
			const externalKey = faker.lorem.word();
			const externalValue: unknown = JSON.parse(faker.datatype.json());
			sessionStorage.setItem(externalKey, JSON.stringify(externalValue));

			// Create some keys
			const keys = new Array(NUM_RECORDS_FOR_CLEAR_TESTS)
				.fill(null)
				.map(() => faker.lorem.word());

			// And some records
			const records = new Array(NUM_RECORDS_FOR_CLEAR_TESTS)
				.fill(null)
				.map(() => JSON.parse(faker.datatype.json()) as Record<string, unknown>);

			// Then loop through the keys and insert the records into storage
			keys
				.forEach((randomKey, index) => {
					prefixedKey = [prefix, randomKey].join(PREFIX_KEY_SEPARATOR);
					record = records[index];

					storage.set(prefixedKey, record);
				});

			// Call clear
			storage.clear();

			// Now loop through keys again, and assert that each have no associated
			// value.
			keys
				.forEach(randomKey => {
					prefixedKey = [prefix, randomKey].join(PREFIX_KEY_SEPARATOR);
					const actual = sessionStorage.getItem(prefixedKey);

					expect(actual).toBeNull();
				});

			// Lastly, check that our external (directly-written) item is still
			// present.
			const storedExternalValue = sessionStorage.getItem(externalKey) as string;

			expect(storedExternalValue).not.toBeNull();

			const parsedStoredExternalValue: unknown = JSON.parse(storedExternalValue);

			expect(parsedStoredExternalValue).toStrictEqual(externalValue);
		});

		test('delete', () => {
			sessionStorage.setItem(prefixedKey, JSON.stringify(record));

			storage.delete(key);

			const actual = sessionStorage.getItem(prefixedKey);

			expect(actual).toBeNull();
		});
	});
});
