import { useEffect, useState } from "react";

import type { Presenter } from "presentation/types";

export const usePresenter = <T extends Presenter>(presenter: T): void => {
	const [, update] = useState(presenter.state);

	useEffect(() => {
		(async () => await presenter.init())();
		return () => presenter.dispose();
	}, [presenter]);

	useEffect(() => {
		const subscription = presenter.state$.subscribe({
			update,
		});

		return () => subscription.unsubscribe();
	}, [presenter]);
};
