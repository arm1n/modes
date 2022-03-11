import type { Success, Failure } from "utils";

import type { DownloadErrorCode, Encoding} from "../enums";

export interface DownloadService {
	download(
		content: string,
		options?: {
			contentType?: string;
			fileName?: string;
			encoding?: Encoding;
		}
	): Promise<Success<void> | Failure<DownloadError>>;
}

export interface DownloadError extends Error {
	code: DownloadErrorCode;
}
