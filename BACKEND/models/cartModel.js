const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    cid: { // customer ID from the client model
        type: Number,
        required: true,
    },
    products: [ // array of products with quantity
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'ProductModel',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    status: {
        type: String,
        enum: ['active', 'purchased'],
        default: 'active',
    }
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
