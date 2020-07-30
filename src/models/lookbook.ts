import { Schema, Model, Document, model } from 'mongoose';

export interface ILookbookDocument extends Document {
    name?: string;
    image?: string;
    description?: string;
}

export interface ILookbook extends ILookbookDocument {
    createdAt?: Date;
    updatedAt?: Date;

    masked(): ILookbookMask;
    newLookbook(lookbook: ILookbook): string;
}

export interface ILookbookMask {
    _id?: string;
    name?: string;
    image?: string;
    description?: string;
}

export interface ILookbookModel {
  // static methods here
  new(doc?: Partial<ILookbook>): ILookbook;
}

const LookbookSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

LookbookSchema.methods.masked = function(): ILookbookMask {
    const self = this as ILookbook;
    return {
        _id: self.id,
        name: self.name,
        image: self.image,
        description: self.description,
    }
}

LookbookSchema.statics.newLookbook = function(lookbook: ILookbook) {
    var newLookbook: ILookbook = lookbook;
    newLookbook.save();
};

export type LookbookModel = Model<ILookbook> & ILookbookModel & ILookbook;

export const Lookbook: LookbookModel = <LookbookModel>model<ILookbook>("Lookbooks", LookbookSchema);
export default Lookbook;