import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    supplyKey: {
        type: String,
        required: true
    },
    tokenId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
    }, {
    timestamps: true
});

productSchema.index({name:1},{unique:true});
export default mongoose.models.Product || mongoose.model("Product", productSchema);