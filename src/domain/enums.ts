export const LINE_BREAKS = {
	LF: "\n",
	CR: "\r",
	CRLF: "\r\n",
	LFCR: "\n\r",
} as const;

export type LineBreak = typeof LINE_BREAKS[keyof typeof LINE_BREAKS];

export const DELIMITERS = {
	COMMA: ",",
	SEMICOLON: ";",
	SPACE: " ",
	TAB: "\t",
	PIPE: "|",
} as const;

export type Delimiter = typeof DELIMITERS[keyof typeof DELIMITERS];

export const ENCODINGS = {
	UTF_8: "UTF-8",
	ISO_8859_1: "ISO-8859-1",
	CP_1252: "CP1252",
} as const;

export type Encoding = typeof ENCODINGS[keyof typeof ENCODINGS];

export const CSV_ERROR_CODES = {
	NO_READ_PARSING: "CSV_ERROR_NO_PARSING",
	NO_READ_HEADERS: "CSV_ERROR_NO_HEADERS",
} as const;

export type CSVErrorCode = typeof CSV_ERROR_CODES[keyof typeof CSV_ERROR_CODES];

export const IMPORT_ERROR_CODES = {
	NO_DATA: "IMPORT_ERROR_NO_DATA",
	NO_KEYS: "IMPORT_ERROR_NO_KEYS",
	NO_VALID_DATA: "IMPORT_ERROR_NO_VALID_DATA",
	NO_SUCCESS: "IMPORT_ERROR_NO_SUCCESS",
} as const;

export type ImportErrorCode =
	typeof IMPORT_ERROR_CODES[keyof typeof IMPORT_ERROR_CODES];

export const EXPORT_ERROR_CODES = {
	NO_DATA: "EXPORT_ERROR_NO_DATA",
	NO_KEYS: "EXPORT_ERROR_NO_KEYS",
	NO_ROWS: "EXPORT_ERROR_NO_ROWS",
} as const;

export type ExportErrorCode =
	typeof EXPORT_ERROR_CODES[keyof typeof EXPORT_ERROR_CODES];

export const DOWNLOAD_ERROR_CODES = {
	NO_SUPPORT_OBJECT_URL: "NO_SUPPORT_OBJECT_URL",
	NO_SUPPORT_BLOB: "NO_SUPPORT_BLOB"
} as const;

export type DownloadErrorCode =
	typeof DOWNLOAD_ERROR_CODES[keyof typeof DOWNLOAD_ERROR_CODES];

export const PAYMENT_TYPES = {
	DEBIT_CARD: "DEBIT_CARD",
	CASH: "CASH",
} as const;

export type PaymentType = typeof PAYMENT_TYPES[keyof typeof PAYMENT_TYPES];
