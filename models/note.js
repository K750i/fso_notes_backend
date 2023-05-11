require('dotenv').config();
const { default: mongoose } = require('mongoose');

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@cluster0.0s3n5bp.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose
  .connect(uri)
  .then(result => console.log('Connected to MongoDB'))
  .catch(console.log);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Note', noteSchema);
