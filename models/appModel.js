import mongoose from "mongoose";

const AppSchema = new mongoose.Schema({
  tzkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const App = mongoose.model("App", AppSchema);
export default App;
