import { Result } from "utils";
import type { Success, Failure } from "utils";

import type { DownloadService, DownloadError } from "domain/services";
import type { DownloadErrorCode, Encoding } from "domain/enums";
import { DOWNLOAD_ERROR_CODES, ENCODINGS } from "domain/enums";

export class HTMLDownloadService implements DownloadService {
	public async download(
		content: string,
		{
			fileName,
			contentType = "text/plain",
			encoding = ENCODINGS.UTF_8,
		}: { contentType?: string; fileName?: string; encoding?: Encoding }
	) {
		const supportsObjectURL =
			"URL" in window &&
			"createObjectURL" in URL &&
			"revokeObjectURL" in URL;

		if (!supportsObjectURL) {
			return Result.failure(
				new HTMLDownloadError(
					DOWNLOAD_ERROR_CODES.NO_SUPPORT_OBJECT_URL
				)
			);
		}

		return new Promise<Success<void> | Failure<DownloadError>>(
			(resolve) => {
				try {
					const blob = new Blob([content], {
						type: `${contentType};charset=${encoding}`,
					});
					const data = URL.createObjectURL(blob);

					const link = document.createElement("a");

					if (fileName) {
						link.download = fileName;
					}
					
					link.href = data;

					link.dispatchEvent(
						new MouseEvent("click", {
							cancelable: true,
							bubbles: true,
							view: window,
						})
					);

					setTimeout(() => {
						URL.revokeObjectURL(data);
						link.remove();

						resolve(Result.success());
					}, 100);
				} catch (error) {
					if (error instanceof Error) {
						console.error(error.message);
					}

					resolve(
						Result.failure(
							new HTMLDownloadError(
								DOWNLOAD_ERROR_CODES.NO_SUPPORT_BLOB
							)
						)
					);
				}
			}
		);
	}
}

export class HTMLDownloadError extends Error implements DownloadError {
	constructor(public readonly code: DownloadErrorCode) {
		super();
	}
}
