const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new Schema({
    user:{type: String, unique: true},
    password: {type: String},
});

adminSchema.pre("save", async function(next){
    if(this.isNew || this.isModified('password')){
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password,saltRounds);
    }
    next();
});

adminSchema.methods.isCorrectPassword = async function(password) {
    return bcrypt.compare(password, this.password);
    
};




const Admin = model("Admin", adminSchema);
module.exports = Admin;