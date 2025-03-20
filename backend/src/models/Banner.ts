import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    image: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBanner>('Banner', BannerSchema); 