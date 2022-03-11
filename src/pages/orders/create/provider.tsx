import { useState } from "react";
import { useSearchParams } from "routing";

import { useContainer, usePresenter } from "hooks";

import { Component } from "./component";

export const Provider = () => {
	const [queryParams] = useSearchParams();
	const productId = queryParams.get("productId") ?? undefined;

	const { container } = useContainer();
	const [presenter] = useState(() =>
		container.ordersCreatePresenterFactory.create({
			productId,
		})
	);

	usePresenter(presenter);

	return <Component presenter={presenter} />;
};
