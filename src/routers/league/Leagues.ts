import { Router, Request, Response } from 'express';
import { BaseRoute } from '../BaseRoute';
import League from '../../models/league';

export class Leagues extends BaseRoute {
    public leagueAction(router: Router): void {
        router.post('/leagues', this.guard, (req: Request, res: Response) => {
            const newLeague = new League({
                name: req.body.league.name,
                players: req.body.league.players
            })
            newLeague.save().then((leagues) => {
                res.status(200).json({
                    response: "League added"
                })
            }).catch((error) => {
                res.json(error)
            });
        });

        router.get('/leagues', this.guard, (req: Request, res: Response) => {
            League.find().then((leagues) => {
                res.json({response: leagues.map((t) => t.masked())});
            }).catch((error) => {
                res.json(error)
            });
        });

        router.delete('/leagues', this.guard, (req: Request, res: Response) => {
            League.deleteMany({}).then((leagues) => {
                res.status(200).json({
                    response: "Removed all leagues"
                })
            }).catch((error) => {
                res.json(error)
            });
        });
    }
}

