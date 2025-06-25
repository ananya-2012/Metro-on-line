const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/metroline",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
   .then(()=> console.log("Database connected"))
   .catch((error)=> console.error("database not connected",error));

const paySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tickets: {
        type: Number,
        required: true,
        min: 1
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['credit', 'debit', 'upi']
    },
    paymentDetails: {
        cardNumber: {
            type: String,
            required: function() { return this.paymentMethod === 'credit' || this.paymentMethod === 'debit'; },
            match: /^[0-9]{16}$/ // Card number must be 16 digits
        },
        upiId: {
            type: String,
            required: function() { return this.paymentMethod === 'upi'; }
        }
    }
}, { timestamps: true });

const Payment=new mongoose.model("payment",paySchema);

module.exports=Payment;