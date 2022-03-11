import type { Catalog, Placeholders } from "./types";

const PATTERN_PLACEHOLDER_OUTER = /(?<placeholder>\{\{[^}]+\}\})/g; // global: {{...}}
const PATTERN_PLACEHOLDER_INNER =
	/\{\{\s*(?<key>[^\s]+)(?:\s(?:'|"|`)(?<text>[^'"`]*)(?:'|"|`))?\s*\}\}/; // local: {{key 'text'}}

export class Localization<T extends Catalog = Catalog> {
	constructor(private catalog: T) {}

	public t(key: keyof T, placeholders: Placeholders = {}) {
		const message = this.catalog[key] || `${key}`;

		return this.formatMessage(message, placeholders);
	}

	public n(
		singularKey: keyof T,
		pluralKey: keyof T,
		count: number,
		placeholders: Placeholders = {}
	) {
		const messages = [
			this.catalog[singularKey] || `${singularKey}`,
			this.catalog[pluralKey] || `${pluralKey}`,
		];
		const message = messages[count === 1 ? 0 : 1];

		return this.formatMessage(message, { ...placeholders, count });
	}

	private formatMessage(
		value: string | T[keyof T],
		placeholders: Placeholders
	): string {
		return this.splitAndFormat(value, placeholders).join("");
	}

	private splitAndFormat(
		value: string | T[keyof T],
		placeholders: Placeholders
	): (string | number | T)[] {
		return `${value}`.split(PATTERN_PLACEHOLDER_OUTER).map((part) => {
			const match = part.match(PATTERN_PLACEHOLDER_INNER);
			const { key, text } = match?.groups || {};
			if (!key || !placeholders[key]) {
				return part;
			}

			const placeholder = placeholders[key];
			return typeof placeholder === "function"
				? placeholder(text)
				: placeholder;
		});
	}
}
