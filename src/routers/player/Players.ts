import { Router, Request, Response } from 'express';
import { BaseRoute } from '../BaseRoute';
import Player from '../../models/player';

export class Players extends BaseRoute {
    public playerAction(router: Router): void {
        router.post('/players', this.guard, (req: Request, res: Response) => {
            const newPlayer = new Player({
                name: req.body.player.name,
                image: req.body.player.image,
            })
            newPlayer.save().then((player) => {
                res.status(200).json({
                    response: "Player added"
                })
            }).catch((error) => {
                res.json(error)
            });
        });

        router.get('/players', this.guard, (req: Request, res: Response) => {
            Player.find().then((players) => {
                res.json({response: players.map((t) => t.masked())});
            }).catch((error) => {
                res.json(error)
            });
        });

        router.delete('/players', this.guard, (req: Request, res: Response) => {
            Player.deleteMany({}).then((players) => {
                res.status(200).json({
                    response: "Removed all players"
                })
            }).catch((error) => {
                res.json(error)
            });
        });
    }
}

