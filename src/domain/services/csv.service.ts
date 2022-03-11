import type { Success, Failure } from "utils";

import type { LineBreak, Delimiter, Encoding, CSVErrorCode } from "../enums";

import type { CSVData } from "./types";

export interface CSVService {
	read(
		data: File,
		options?: {
			delimiter?: Delimiter;
			encoding?: Encoding;
			linebreak?: LineBreak;
		}
	): Promise<Success<CSVData> | Failure<CSVError>>;
	write(
		data: Array<string[]>,
		options?: {
			delimiter?: Delimiter;
			linebreak?: LineBreak;
		}
	): Promise<Success<string> | Failure<CSVError>>;
}

export interface CSVError extends Error {
	code: CSVErrorCode;
}
