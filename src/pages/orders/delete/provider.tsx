import { useState } from "react";
import { useParams } from "routing";

import { useContainer, usePresenter } from "hooks";

import { Component } from "./component";

export const Provider = () => {
	const { id: orderId } = useParams();

	const { container } = useContainer();
	const [presenter] = useState(() =>
		container.ordersDeletePresenterFactory.create({
			orderId,
		})
	);

	usePresenter(presenter);

	return <Component presenter={presenter} />;
};
