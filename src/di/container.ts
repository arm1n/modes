import { WebStorage } from "data/storages";
import { StorageDatabase } from "data/databases";
import { OrderRepository, ProductRepository } from "data/repositories";
import { OrderMapper, ProductMapper } from "data/mappers";
import {
	HTMLCSVService,
	HTMLDownloadService,
	ProductImportService,
	OrderExportService,
} from "data/services";

import {
	GetProductsUseCase,
	ImportProductsUseCase,
	ClearProductsUseCase,
} from "domain/use-cases/product";
import {
	GetOrdersUseCase,
	GetOrderByIdUseCase,
	GetComposedOrdersUseCase,
	CreateOrderUseCase,
	UpdateOrderUseCase,
	DeleteOrderUseCase,
	ClearOrdersUseCase,
	ExportOrdersUseCase,
} from "domain/use-cases/order";

import { SearchPresenterFactory } from "presentation/search";
import { OrdersPresenterFactory } from "presentation/orders";
import { ProductsPresenterFactory } from "presentation/products";
import { ProductsImportPresenterFactory } from "presentation/products/import";
import { ProductsClearPresenterFactory } from "presentation/products/clear";
import { OrdersCreatePresenterFactory } from "presentation/orders/create";
import { OrdersUpdatePresenterFactory } from "presentation/orders/update";
import { OrdersDeletePresenterFactory } from "presentation/orders/delete";
import { OrdersClearPresenterFactory } from "presentation/orders/clear";
import { OrdersFormPresenterFactory } from "presentation/orders/form";
import { OrdersExportPresenterFactory } from "presentation/orders/export";

export class Container {
	private webStorage = new WebStorage(window.localStorage);
	private database = new StorageDatabase(this.webStorage);

	private orderMapper = new OrderMapper();
	private orderRepository = new OrderRepository(
		this.database,
		this.orderMapper
	);

	private productMapper = new ProductMapper();
	private productRepository = new ProductRepository(
		this.database,
		this.productMapper
	);

	private csvService = new HTMLCSVService();
	private downloadService = new HTMLDownloadService();
	private ordersExportService = new OrderExportService();
	private productImportService = new ProductImportService(
		this.productRepository
	);

	private getProductsUseCase = new GetProductsUseCase(this.productRepository);
	private importProductsUseCase = new ImportProductsUseCase(
		this.csvService,
		this.productImportService
	);
	private clearProductsUseCase = new ClearProductsUseCase(
		this.productRepository
	);
	private getOrdersUseCase = new GetOrdersUseCase(this.orderRepository);
	private getOrderByIdUseCase = new GetOrderByIdUseCase(this.orderRepository);
	private getComposedOrdersUseCase = new GetComposedOrdersUseCase(
		this.orderRepository,
		this.productRepository
	);
	private createOrderUseCase = new CreateOrderUseCase(this.orderRepository);
	private updateOrderUseCase = new UpdateOrderUseCase(this.orderRepository);
	private deleteOrderUseCase = new DeleteOrderUseCase(this.orderRepository);
	private clearOrdersUseCase = new ClearOrdersUseCase(this.orderRepository);
	public exportOrdersUseCase = new ExportOrdersUseCase(
		this.getComposedOrdersUseCase,
		this.ordersExportService,
		this.downloadService,
		this.csvService
	);

	public searchPresenterFactory = new SearchPresenterFactory();
	public ordersPresenterFactory = new OrdersPresenterFactory(
		this.getComposedOrdersUseCase,
		this.getProductsUseCase,
		this.searchPresenterFactory
	);
	public productsPresenterFactory = new ProductsPresenterFactory(
		this.getProductsUseCase,
		this.searchPresenterFactory
	);
	public productsImportPresenterFactory = new ProductsImportPresenterFactory(
		this.importProductsUseCase
	);
	public productsClearPresenterFactory = new ProductsClearPresenterFactory(
		this.clearProductsUseCase
	);
	public ordersFormPresenterFactory = new OrdersFormPresenterFactory(
		this.getProductsUseCase
	);
	public ordersCreatePresenterFactory = new OrdersCreatePresenterFactory(
		this.ordersFormPresenterFactory,
		this.createOrderUseCase
	);
	public ordersUpdatePresenterFactory = new OrdersUpdatePresenterFactory(
		this.ordersFormPresenterFactory,
		this.getOrderByIdUseCase,
		this.updateOrderUseCase
	);
	public ordersDeletePresenterFactory = new OrdersDeletePresenterFactory(
		this.getOrderByIdUseCase,
		this.deleteOrderUseCase
	);
	public ordersClearPresenterFactory = new OrdersClearPresenterFactory(
		this.clearOrdersUseCase
	);
	public ordersExportPresenterFactory = new OrdersExportPresenterFactory(
		this.exportOrdersUseCase
	);
}
