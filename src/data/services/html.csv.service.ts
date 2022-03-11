import { Result } from "utils";
import type { Success, Failure } from "utils";

import type { CSVService, CSVError, CSVData, CSVItem } from "domain/services";
import type { LineBreak, Delimiter, CSVErrorCode } from "domain/enums";
import {
	CSV_ERROR_CODES,
	LINE_BREAKS,
	DELIMITERS,
	ENCODINGS,
} from "domain/enums";

export class HTMLCSVService implements CSVService {
	async read(
		file: File,
		{
			delimiter = DELIMITERS.SEMICOLON,
			encoding = ENCODINGS.UTF_8,
			lineBreak = LINE_BREAKS.LF,
		} = {}
	) {
		return new Promise<Success<CSVData> | Failure<CSVError>>((resolve) => {
			const reader = new FileReader();

			reader.onload = () => {
				resolve(
					typeof reader.result !== "string"
						? Result.failure(
								new HTMLCSVError(
									CSV_ERROR_CODES.NO_READ_PARSING
								)
						  )
						: this.parse(reader.result)
				);
			};

			reader.onerror = (error) => {
				resolve(
					Result.failure(
						new HTMLCSVError(CSV_ERROR_CODES.NO_READ_PARSING)
					)
				);
			};

			reader.readAsText(file, encoding);
		});
	}

	public async write(
		data: Array<string[]>,
		{ delimiter = DELIMITERS.SEMICOLON, lineBreak = LINE_BREAKS.LF } = {}
	) {
		const result = data.map((row) => row.join(delimiter)).join(lineBreak);

		return Result.success(result);
	}

	private parse(
		input: string,
		delimiter: Delimiter = DELIMITERS.SEMICOLON,
		lineBreak: LineBreak = LINE_BREAKS.LF
	): Success<CSVData> | Failure<HTMLCSVError> {
		const [cols, ...rows] = input.split(lineBreak);
		const keys = cols.split(delimiter);

		if (keys.length === 0) {
			return Result.failure(
				new HTMLCSVError(CSV_ERROR_CODES.NO_READ_HEADERS)
			);
		}

		const data = rows.map((row) =>
			row.split(delimiter).reduce((data, value, index) => {
				const key = keys[index].trim();
				if (key) {
					data = {
						...data,
						...{ [key]: value },
					};
				}

				return data;
			}, {} as CSVItem)
		);

		return Result.success(data);
	}
}

export class HTMLCSVError extends Error implements CSVError {
	constructor(public readonly code: CSVErrorCode) {
		super();
	}
}
