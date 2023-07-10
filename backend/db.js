const mongoose = require('mongoose');
mongoose.set("strictQuery", true);
const MongoDB = () => {
    mongoose.connect("mongodb+srv://mahankalipraneeth:praneeth123@chatcluster.e54rfh9.mongodb.net/chatfusion?retryWrites=true&w=majority", {
        useNewUrlParser: true, useUnifiedTopology: true, // Add this option
        useCreateIndex: true,
        useFindAndModify: false }, async (err, res) => {
        if (err) console.log("---", err);
        else {
            console.log("connected")

        }
    });

};


module.exports = MongoDB;
