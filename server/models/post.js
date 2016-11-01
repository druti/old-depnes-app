import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema({
  content: { type: 'Object', required: true },
  htmlContent: { type: 'String', required: true },
  textContent: { type: 'String', required: true },
  cuid: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});

if (process.env.NODE_ENV === 'development') {
  postSchema.set('minimize', false);
}

export default mongoose.model('Post', postSchema);
