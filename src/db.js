import mongoose from 'mongoose';

const server = process.env.DB_HOST;
const database = process.env.DB_NAME;

class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser: true, useUnifiedTopology: true })
       .then(() => {
         console.log('Database connection successful!')
       })
       .catch(err => {
         console.error('Database connection error!')
       })
  }
}

export default new Database();