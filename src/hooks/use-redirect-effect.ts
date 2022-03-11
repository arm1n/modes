import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import type {
	State,
	Presenter,
	RedirectToPageEffect,
} from "presentation/types";

type Page<T = never> = T extends Presenter<State, RedirectToPageEffect<infer U>>
	? U
	: never;

export const useRedirectEffect = <
	T extends Presenter<State, RedirectToPageEffect<Page>>
>(
	presenter: T,
	mapPageToRoute: (page: Page<T>) => string | undefined
): void => {
	const navigate = useNavigate();
	const mapPageToRouteRef = useRef(mapPageToRoute);
	mapPageToRouteRef.current = mapPageToRoute;

	useEffect(() => {
		const subscription = presenter.effects$.subscribe({
			update: ({ name, data: { page } }) => {
				switch (name) {
					case "redirectToPage": {
						const route = mapPageToRouteRef.current(page);
						if (typeof route === "string") {
							navigate(route);
						}
						break;
					}

					default:
				}
			},
		});

		return () => subscription.unsubscribe();
	}, [presenter.effects$, navigate]);
};
