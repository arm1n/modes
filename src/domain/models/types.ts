export interface Model {
	id: string;
}

export interface ModelType<T extends Model> {
	new (props: T): T;
}