const mongoose = require("mongoose")
const env = require('dotenv');

const app = require('./app');
 
env.config({ path: './config.env' });

mongoose.connect(process.env.MONGODB_DATABASE,{
  useUnifiedTopology: true ,
  useNewUrlParser:true,
  useFindAndModify:false,
  useCreateIndex:true
}).then(()=>{
  // console.log(con.connections);
  console.log("DataBase Connection Successful")
}).catch((error)=>{
  console.log(error.name,error.message)
  process.exit(1)
})

const port = 3000
app.listen(port, () => {
  console.log(`App is now up and running on port ${port}...`);
});