import { StorageType } from '~/models/storage-type.model';

/**
 * Describes a storage object
 *
 * @public
 */
export type IStorage = {
	get: <T> (key: string) => T | null;
	set: <T> (key: string, value: T) => T | null;
	clear: () => void;
	delete: <T> (key: string) => T | null;
};

/**
 * Represents a storage object
 *
 * @public
 */
export class Storage implements IStorage {
	/**
	 * The character used to separate a key and its prefix
	 */
	static readonly PREFIX_KEY_SEPARATOR = '-';

	#keys: string[] = [];

	readonly #prefix: string;

	readonly #storage: globalThis.Storage;

	/**
	 * @param prefix - The string by which keys should be prefixed
	 * @param type - The type of storage to use; defaults to session
	 */
	constructor (prefix: string, type: StorageType = StorageType.SESSION) {
		this.#prefix = prefix;

		if (type === StorageType.LOCAL) this.#storage = localStorage;
		else this.#storage = sessionStorage;
	}

	#prefixKey (key: string): string {
		return [this.#prefix, key].join(Storage.PREFIX_KEY_SEPARATOR);
	}

	/**
	 * Retrieves an item from storage
	 *
	 * @param key - The key with which the item is associated
	 *
	 * @returns The associated item or null if an item is not associated with the
	 * provided key.
	 */
	get <T> (key: string): T | null {
		const prefixedKey = this.#prefixKey(key);

		const storedValue = this.#storage.getItem(prefixedKey);

		if (storedValue === null) return null;

		try {
			return JSON.parse(storedValue) as T;
		} catch (err) {
			this.#storage.removeItem(prefixedKey);

			return null;
		}
	}

	/**
	 * Sets an item in storage
	 *
	 * @param key - The key with which to associate the item
	 * @param value - The item to store
	 *
	 * @returns The stored item or null if the item could not be stored.
	 */
	set <T> (key: string, value: T): T | null {
		const prefixedKey = this.#prefixKey(key);

		try {
			const stringValue = JSON.stringify(value);
			this.#storage.setItem(prefixedKey, stringValue);
			this.#keys.push(key);

			return this.get<T>(prefixedKey);
		} catch (err) {
			this.#storage.removeItem(prefixedKey);

			return null;
		}
	}

	/**
	 * Removes all keys and items from storage.  Only removes items that were set
	 * by this particular storage instance.
	 */
	clear (): void {
		[...this.#keys].forEach(key => this.delete(key));
	}

	/**
	 * Deletes an item from storage
	 *
	 * @param key - The key with which the item to be deleted is associated
	 *
	 * @returns The deleted item or null if no item associated with the provided
	 * key is found.
	 */
	delete <T> (key: string): T | null {
		const prefixedKey = this.#prefixKey(key);

		const storedItem = this.get<T>(prefixedKey);

		this.#storage.removeItem(prefixedKey);

		const keyIndex = this.#keys.indexOf(key);

		if (keyIndex >= 0) this.#keys.splice(keyIndex, 1);

		return storedItem;
	}
}
