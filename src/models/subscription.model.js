import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // one who subsribing
        ref: "User",
        required: true

    },
    channel: {
        type: Schema.Types.ObjectId, // one whom subscriber is subsribing
        ref: "User",
        required: true

    },
}, {timestamps: true})

subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });



export const Subscription = mongoose.model("Subscription", subscriptionSchema)