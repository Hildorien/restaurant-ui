import mongoose, { Document, MongooseDocumentMiddleware, Schema } from 'mongoose';
import { OrderStatus } from './order';
import { OrderProductDocument, OrderProductSchema } from './mongoOrderProduct';

const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseLeanId = require('mongoose-lean-id');

export interface OrderDocument extends Document {
	id: string;
	displayId: string;
	externalId: string;
	companyId?: string;
	cookingTime: number;
	country: string;
	platform: string;
	createdAt: Date;
	invoice?: {
		externalId?: string;
		number: string;
		type: string;
		seller: { id: string; name: string; taxType: string };
		salesPoint: string;
		paymentMethod: string;
		date: Date;
		client: { id: string; name: string; taxType: string };
		items: { qty: number; name: string; unitPrice: number }[];
		verifier: { id: string; url: string; date: Date };
		discount: number;
		total: number;
	};
	events: {
		createdAt?: Date;
		takenAt?: Date;
		readyAt?: Date;
		deliveredAt?: Date;
		rejectedAt?: Date;
		cancelledAt?: Date;
	};
	autoAccepted: boolean;
	isMarketingOrder: boolean;
	status: string;
	cancelReason?: string;
	rejectReason?: string;
	paymentMethod: string;
	deliveryMethod: string;
	tz?: string;
	observations?: string;
	products: OrderProductDocument[];
	store: {
		id: string;
		externalId: string;
	};
	brand: {
		id: number;
		name: string;
	};
	trunk: {
		id: string;
		name: string;
	};
	branch: {
		id: number;
		name: string;
	};
	customer: {
		completeName: string;
		phone?: string;
	};
	delivery: {
		address?: string;
		additionalDetails?: string;
	};
	pricing: {
		currency?: string;
		charges: {
			shipping?: number;
			service?: number;
		};
		totalOrder: number;
		totalProducts: number;
		totalDiscounts?: number;
		totalChargesDiscount?: number;
	};
}

export const OrderSchema = new Schema<OrderDocument>(
	{
		_id: {
			type: Schema.Types.String,
		},
		displayId: {
			type: Schema.Types.String,
		},
		externalId: {
			type: Schema.Types.String,
		},
		companyId: {
			type: Schema.Types.Number,
			null: true,
		},
		cookingTime: {
			type: Schema.Types.Number,
		},
		country: {
			type: Schema.Types.String,
		},
		platform: {
			type: Schema.Types.String,
		},
		createdAt: {
			type: Schema.Types.Date,
			expires: 7884000, // 3 months
		},
		events: new Schema({
			_id: {
				_id: false,
			},
			createdAt: {
				type: Schema.Types.Date,
				null: false,
				default: new Date(),
			},
			takenAt: {
				type: Schema.Types.Date,
				null: true,
			},
			readyAt: {
				type: Schema.Types.Date,
				null: true,
			},
			deliveredAt: {
				type: Schema.Types.Date,
				null: true,
			},
			rejectedAt: {
				type: Schema.Types.Date,
				null: true,
			},
			cancelledAt: {
				type: Schema.Types.Date,
				null: true,
			},
		}),
		autoAccepted: {
			type: Schema.Types.Boolean,
			default: false,
		},
		isMarketingOrder: {
			type: Schema.Types.Boolean,
			default: false,
		},
		status: {
			type: Schema.Types.String,
		},
		cancelReason: {
			type: Schema.Types.String,
			null: true,
		},
		rejectReason: {
			type: Schema.Types.String,
			null: true,
		},
		paymentMethod: {
			type: Schema.Types.String,
		},
		deliveryMethod: {
			type: Schema.Types.String,
		},
		tz: {
			type: Schema.Types.String,
			null: true,
		},
		observations: {
			type: Schema.Types.String,
			null: true,
		},
		products: [
			{
				type: OrderProductSchema,
			},
		],
		store: new Schema({
			_id: {
				_id: false,
			},
			id: {
				type: Schema.Types.String,
			},
			externalId: {
				type: Schema.Types.String,
			},
		}),
		brand: new Schema({
			_id: {
				_id: false,
			},
			id: {
				type: Schema.Types.Number,
			},
			name: {
				type: Schema.Types.String,
			},
		}),
		trunk: new Schema({
			_id: {
				_id: false,
			},
			id: {
				type: Schema.Types.String,
			},
			name: {
				type: Schema.Types.String,
			},
		}),
		branch: new Schema({
			_id: {
				_id: false,
			},
			id: {
				type: Schema.Types.Number,
			},
			name: {
				type: Schema.Types.String,
			},
		}),
		customer: new Schema({
			_id: {
				_id: false,
			},
			completeName: {
				type: Schema.Types.String,
			},
			phone: {
				type: Schema.Types.String,
				null: true,
			},
		}),
		delivery: new Schema({
			_id: {
				_id: false,
			},
			address: {
				type: Schema.Types.String,
				null: true,
			},
			additionalDetails: {
				type: Schema.Types.String,
				null: true,
			},
		}),
		pricing: new Schema({
			_id: {
				_id: false,
			},
			currency: {
				type: Schema.Types.String,
				null: true,
			},
			charges: new Schema({
				_id: {
					_id: false,
				},
				shipping: {
					type: Schema.Types.Number,
					null: true,
				},
				service: {
					type: Schema.Types.Number,
					null: true,
				},
			}),
			totalOrder: {
				type: Schema.Types.Number,
			},
			totalProducts: {
				type: Schema.Types.Number,
			},
			totalDiscounts: {
				type: Schema.Types.Number,
				null: true,
			},
			totalChargesDiscount: {
				type: Schema.Types.Number,
				null: true,
			},
		}),
		invoice: new Schema({
			_id: {
				_id: false,
			},
			externalId: {
				type: Schema.Types.String,
			},
			number: {
				type: Schema.Types.String,
			},
			type: {
				type: Schema.Types.String,
			},
			seller: new Schema({
				_id: {
					_id: false,
				},
				id: {
					type: Schema.Types.String,
				},
				name: {
					type: Schema.Types.String,
				},
				taxType: {
					type: Schema.Types.String,
				},
			}),
			salesPoint: {
				type: Schema.Types.String,
			},
			paymentMethod: {
				type: Schema.Types.String,
			},
			date: {
				type: Schema.Types.Date,
			},
			client: new Schema({
				_id: {
					_id: false,
				},
				id: {
					type: Schema.Types.String,
				},
				name: {
					type: Schema.Types.String,
				},
				taxType: {
					type: Schema.Types.String,
				},
			}),
			items: [
				new Schema({
					_id: {
						_id: false,
					},
					qty: {
						type: Schema.Types.Number,
					},
					name: {
						type: Schema.Types.String,
					},
					unitPrice: {
						type: Schema.Types.Number,
					},
				}),
			],
			verifier: new Schema({
				_id: {
					_id: false,
				},
				id: {
					type: Schema.Types.String,
				},
				url: {
					type: Schema.Types.String,
				},
				date: {
					type: Schema.Types.Date,
				},
			}),
			discount: {
				type: Schema.Types.Number,
			},
			total: {
				type: Schema.Types.Number,
			},
		}),
	},
	{
		collection: 'order',
		versionKey: false,
		timestamps: false,
	}
);

// Indexes
OrderSchema.index({ store: 1 });
OrderSchema.index({ 'brand.id': 1 });
OrderSchema.index({ 'trunk.id': 1 });
OrderSchema.index({ 'branch.id': 1 });
OrderSchema.index({ createdAt: -1 });

// Plugins
OrderSchema.plugin(mongooseLeanId);
OrderSchema.plugin(mongoosePaginate);

const preSaveMethods: MongooseDocumentMiddleware[] = ['save', 'updateOne'];
OrderSchema.pre(preSaveMethods, function (next) {
	this.status = getOrderStatus(this);
	next();
});

function getOrderStatus(orderDocument: OrderDocument): OrderStatus {
	if (!orderDocument.events) {
		orderDocument.events = {};
	}

	if (orderDocument.events.rejectedAt) {
		return OrderStatus.REJECTED;
	}

	if (orderDocument.events.cancelledAt) {
		return OrderStatus.CANCELLED;
	}

	if (orderDocument.events.deliveredAt) {
		return OrderStatus.DELIVERED;
	}

	if (orderDocument.events.readyAt) {
		return OrderStatus.READY_FOR_PICKUP;
	}

	if (orderDocument.events.takenAt) {
		return OrderStatus.TAKEN;
	}

	return OrderStatus.NEW;
}

// @ts-ignore
export const OrderModel = mongoose.model<OrderDocument, mongoose.PaginateModel<OrderDocument>>('Order', OrderSchema);
