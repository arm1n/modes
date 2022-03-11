import { useState } from "react";

import { useContainer, usePresenter } from "hooks";

import { Component } from "./component";

export const Provider = () => {
	const { container } = useContainer();
	const [presenter] = useState(() =>
		container.productsPresenterFactory.create()
	);

	usePresenter(presenter);

	return <Component presenter={presenter} />;
};
