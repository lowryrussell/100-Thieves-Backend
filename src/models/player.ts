import { Schema, Model, Document, model } from 'mongoose';

export interface IPlayerDocument extends Document {
    name?: string;
    image?: string;
}

export interface IPlayer extends IPlayerDocument {
    createdAt?: Date;
    updatedAt?: Date;

    masked(): IPlayerMask;
    newPlayer(player: IPlayer): string;
}

export interface IPlayerMask {
    _id?: string;
    name?: string;
    image?: string;
}

export interface IPlayerModel {
  // static methods here
  new(doc?: Partial<IPlayer>): IPlayer;
}

const PlayerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
});

PlayerSchema.methods.masked = function(): IPlayerMask {
    const self = this as IPlayer;
    return {
        _id: self.id,
        name: self.name,
        image: self.image,
    }
}

PlayerSchema.statics.newPlayer = function(player: IPlayer) {
    var newPlayer: IPlayer = player;
    newPlayer.save();
};

export type PlayerModel = Model<IPlayer> & IPlayerModel & IPlayer;

export const Player: PlayerModel = <PlayerModel>model<IPlayer>("Players", PlayerSchema);
export default Player;