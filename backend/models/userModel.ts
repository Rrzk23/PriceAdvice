import { InferSchemaType, Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: { type: 'string', required: true, unique: true },
  email: { type: 'string', required: true, unique: true, select: false },
  password: { type: 'string', required: true, select: false },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>('User', userSchema);

