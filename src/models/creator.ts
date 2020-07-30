import { Schema, Model, Document, model } from 'mongoose';
var twitchApi = require('twitch-api-v5');
twitchApi.clientID = "00693mp762oy9caslbua944wr6h83x"

export interface ICreatorDocument extends Document {
    name?: string;
    image?: string;
    platform?: Platform;
    channelName?: string;
    twitterHandle?: string;
    instagramHandle?: string;
}

export interface ICreator extends ICreatorDocument {
    createdAt?: Date;
    updatedAt?: Date;

    masked(): ICreatorMask;
    getStatus(): Status;
    newCreator(creator: ICreator): string;
}

export interface ICreatorMask {
    _id?: string;
    name?: string;
    image?: string;
    platform?: Platform;
    status?: Status;
    channelName?: string;
    twitterHandle?: string;
    instagramHandle?: string;
}

export enum Platform {
    twitch = "twitch",
    youtube = "youtube",
    mixer = "mixer",
}

export enum Status {
    live = "live",
    offline = "offline"
}

export interface ICreatorModel {
  // static methods here
  new(doc?: Partial<ICreator>): ICreator;
}

const CreatorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    platform: {
        type: Platform,
        required: true,
    },
    channelName: {
        type: String,
        required: true,
    },
    twitterHandle: {
        type: String,
        required: true,
    },
    instagramHandle: {
        type: String,
        required: true,
    },
});

CreatorSchema.methods.masked = function(): ICreatorMask {
    const self = this as ICreator;
    return {
        _id: self.id,
        name: self.name,
        image: self.image,
        platform: self.platform,
        status: Status.offline,
        channelName: self.channelName,
        twitterHandle: self.twitterHandle,
        instagramHandle: self.instagramHandle
    }
}

CreatorSchema.methods.getStatus = async function(): Promise<Status> {
    const self = this as ICreator;
    const channel = await twitchApi.users.usersByName({users: ["nadeshot"]}, (err, res) => {
        if(err) {
            console.log(err);
        } else {
            twitchApi.streams.channel({ channelID: res.users[0]._id }, (err, res) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log(res);
                    if (res.stream !== null) {
                        return Status.live;
                    } else {
                        return Status.offline;
                    }
                }
            })
        }
    })
    return channel;
}

CreatorSchema.statics.newCreator = function(creator: ICreator) {
    var newCreator: ICreator = creator;
    newCreator.save();
};

export type CreatorModel = Model<ICreator> & ICreatorModel & ICreator;

export const Creator: CreatorModel = <CreatorModel>model<ICreator>("Creators", CreatorSchema);
export default Creator;