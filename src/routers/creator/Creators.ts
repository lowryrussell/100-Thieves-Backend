import { Router, Request, Response } from 'express';
import { Creator, Status, Platform, ICreatorMask } from '../../models/creator';
import { BaseRoute } from '../BaseRoute';

const fetch = require('node-fetch');
const twitchApi = require('twitch-api-v5');

twitchApi.clientID = "00693mp762oy9caslbua944wr6h83x";

export class Creators extends BaseRoute {
    public profileAction(router: Router): void {
        router.post('/creators', this.guard, (req: Request, res: Response) => {
            const newCreator = new Creator({
                name: req.body.creator.name,
                image: req.body.creator.image,
                platform: req.body.creator.platform,
                channelName: req.body.creator.channelName,
                twitterHandle: req.body.creator.twitterHandle,
                instagramHandle: req.body.creator.instagramHandle,
            })
            newCreator.save().then((user) => {
                res.status(200).json({
                    response: "Creator added"
                })
            }).catch((error) => {
                res.json(error)
            });
        });

        router.get('/creators', this.guard, (req: Request, res: Response) => {
            Creator.find().then(async (creators) => {
                let maskedCreators: Array<ICreatorMask> = creators.map((t) => t.masked());
                maskedCreators.forEach((creator, index) => {
                    if (creator.channelName === "nadeshot") {
                        maskedCreators.splice(index, 1);
                        maskedCreators.unshift(creator);
                    }
                })

                const creatorStatuses = await this.getStreamer(maskedCreators);
                console.log(creatorStatuses);
                maskedCreators.forEach((_, index) => {
                    if (maskedCreators[index].platform === Platform.twitch) {
                        if (creatorStatuses[index].stream === null) {
                            maskedCreators[index].status = Status.offline;
                        } else {
                            maskedCreators[index].status = Status.live;
                        }
                    } else if (maskedCreators[index].platform === Platform.youtube) {
                        if (creatorStatuses[index].items !== null) {
                            if (creatorStatuses[index].items.length === 0) {
                                maskedCreators[index].status = Status.offline;
                            } else {
                                maskedCreators[index].status = Status.live;
                            }
                        } else {
                            maskedCreators[index].status = Status.offline;
                        }
                        
                    } else if (maskedCreators[index].platform === Platform.mixer) {
                        // do this later
                    }
                })
                return maskedCreators;
            })
            .then((creators) => {
                res.json({response: creators});
            })
            .catch((error) => {
                res.json(error)
            });
        });

        router.delete('/creators', this.guard, (req: Request, res: Response) => {
            Creator.deleteMany({}).then((users) => {
                res.status(200).json({
                    response: "Removed all creators"
                })
            }).catch((error) => {
                res.json(error)
            });
        });
    }

    private async getStreamer(creators: Array<ICreatorMask>) {
        const creatorsPromiseArr = []
        creators.map((creator) => {
            creatorsPromiseArr.push(new Promise((resolve, reject) => {
                if (creator.platform === Platform.twitch) {
                    twitchApi.users.usersByName({users: [creator.channelName]}, (err, res) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            twitchApi.streams.channel({channelID: res.users[0]._id}, (err, res) => {
                                if (err) {
                                    console.log(err);
                                    reject(err);
                                } else {
                                    resolve(res);
                                }
                            })
                        }
                    })
                } else if (creator.platform === Platform.youtube) {
                    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${creator.channelName}&eventType=live&type=video&key=${process.env.YOUTUBE_API_KEY}`)
                    .then(response => response.json())
                    .then((response) => {
                        resolve(response);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
                } else if (creator.platform === Platform.mixer) {
                    // do this later
                }
            }))
        })
        return await Promise.all(creatorsPromiseArr)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error)
            });
    }
}

