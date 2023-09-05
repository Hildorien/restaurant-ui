import { Document, Schema } from 'mongoose';

export interface OrderProductDocument extends Document {
	type: string;
	sku: string;
	name: string;
	quantity: number;
	unitPrice: number;
	comment?: string;
	subItems?: OrderProductDocument[];
}

export const OrderProductSchema = new Schema<OrderProductDocument>({
	_id: {
		_id: false,
	},
	type: {
		type: Schema.Types.String,
	},
	sku: {
		type: Schema.Types.String,
	},
	name: {
		type: Schema.Types.String,
	},
	quantity: {
		type: Schema.Types.Number,
	},
	unitPrice: {
		type: Schema.Types.Number,
	},
	comment: {
		type: Schema.Types.String,
		null: true,
	},
});

OrderProductSchema.add({
	subItems: {
		type: [OrderProductSchema],
		null: true,
	},
});
