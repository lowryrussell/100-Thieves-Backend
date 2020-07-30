import { Schema, Model, Document, model } from 'mongoose';

export interface ILeagueDocument extends Document {
    name?: string;
    players?: [IPlayerDocument];
}

export interface IPlayerDocument {
    name?: string;
    social?: [ISocialDocument];
}

export interface ISocialDocument {
    twitter?: string;
}

export interface ILeague extends ILeagueDocument {
    createdAt?: Date;
    updatedAt?: Date;

    masked(): ILeagueMask;
    newLeague(league: ILeague): string;
}

export interface ILeagueMask {
    _id?: string;
    name?: string;
    players?: [IPlayerDocument];
}

export interface ILeagueModel {
  // static methods here
  new(doc?: Partial<ILeague>): ILeague;
}

const LeagueSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    players: [{
        name: {
            type: String,
            required: true,
        },
        social: {
            twitter: {
                type: String,
                required: true,
            }
        }
    }]
});

LeagueSchema.methods.masked = function(): ILeagueMask {
    const self = this as ILeague;
    return {
        _id: self.id,
        name: self.name,
        players: self.players,
    }
}

LeagueSchema.statics.newLeague = function(league: ILeague) {
    var newLeague: ILeague = league;
    newLeague.save();
};

export type LeagueModel = Model<ILeague> & ILeagueModel & ILeague;

export const League: LeagueModel = <LeagueModel>model<ILeague>("Leagues", LeagueSchema);
export default League;