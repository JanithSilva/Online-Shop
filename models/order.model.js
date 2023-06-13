const db = require('../data/database');
const mongodb  = require('mongodb');
//Status => pending, fullfilled, cancelled
class Order{
    constructor(cart, userData, status = 'pending', date, orderId){
        this.productData = cart;
        this.userData = userData;
        this.status = status;
        this.date = new Date(date);
        if(this.date){
            this.formattedDate = this.date.toLocaleDateString('en-US', {
                weekday : 'short',
                day :  'numeric',
                month : 'long',
                year : 'numeric'
            })
        }
        if(orderId){
          this.id = orderId.toString();
        }
        
    }

    static transformOrderDocument(orderDoc) {
        return new Order(
          orderDoc.orderDocument.productData,
          orderDoc.orderDocument.userData,
          orderDoc.orderDocument.status,
          orderDoc.orderDocument.date,
          orderDoc._id

        );
      }
    
      static transformOrderDocuments(orderDocs) {
        return orderDocs.map(this.transformOrderDocument);
      }

    static async findAll() {
        const orders = await db
          .getDB()
          .collection('order')
          .find()
          .sort({ _id: -1 })
          .toArray();
    
        return this.transformOrderDocuments(orders);
      }
    
      static async findAllForUser(userId) {
        const uid = new mongodb.ObjectId(userId);
        const orders = await db
          .getDB()
          .collection('order')
          .find({ 'orderDocument.userData._id': uid })
          .sort({ _id: -1 })
          .toArray();
        return this.transformOrderDocuments(orders);
      }
    
      static async findById(orderId) {
        const order = await db
          .getDB()
          .collection('order')
          .findOne({ _id: new mongodb.ObjectId(orderId) });
    
        return this.transformOrderDocument(order);
      }

    save(){
        if(this.id){
            const orderId = new mongodb.ObjectId(this.id);
            return db
                .getDB()
                .collection('order')
                .updateOne({ _id: orderId }, { $set: { "orderDocument.status" : this.status } });

        }else{
            const orderDocument = {
                userData : this.userData,
                productData : this.productData,
                date : new Date(),
                status : this.status
            }
            return db.getDB().collection('order').insertOne({orderDocument});
        }

    }
}

module.exports = Order;