import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types

const itemSchema = new mongoose.Schema({
    owner: {type: ObjectId, ref: 'User'},
    title: {type: String, required: true},
    model: {type: String, required: true},
    image: {type: String, required: true},
    year: {type: Number, required: false},
    category: {type: String, required: true},
    contact: {type: String, required: true},
    fuel_type: { type: String, required: false },
    condition: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    isAvaliable: {type: Boolean, default: true}
},{timestamps: true})

const Item = mongoose.model('Item', itemSchema)

export default Item