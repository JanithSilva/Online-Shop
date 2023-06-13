const bcrypt = require('bcryptjs');
const db = require("../data/database");
const mongodb = require('mongodb');

class User {

    constructor(email, password, fullname, street, postalcode, city) {
        this.email = email;
        this.password = password;
        this.fullname = fullname;
        this.address = {
            street: street,
            postalcode: postalcode,
            city: city
        };
    }

    static findById(userId){
        try{
            const uid = new mongodb.ObjectId(userId);
            return db.getDB().collection('user').findOne({_id:uid}, {projection : {password: 0} });
            }catch(error){
                throw error;
            }
    }

    async signup() {
        const hashedPasword = await bcrypt.hash(this.password, 12);
        await db.getDB().collection('user').insertOne({
            email: this.email,
            password: hashedPasword,
            name: this.fullname,
            address: this.address
        });
    }

    getUserWithSameEmail() {
        return db.getDB().collection('user').findOne({ email: this.email });
    }

    async existsAlredy(){
        const existingUser = await this.getUserWithSameEmail();
        if(existingUser){
            return true;
        }
        else{
            return false;
        }
    }

    hasMatchingPassword(hashedPassword) {
        return bcrypt.compare(this.password, hashedPassword);
    }


}

module.exports = User;