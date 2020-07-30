import { Router, Request, Response } from 'express';
import { BaseRoute } from '../BaseRoute';
import Lookbook from '../../models/lookbook';

export class Lookbooks extends BaseRoute {
    public lookbookAction(router: Router): void {
        router.post('/lookbooks', this.guard, (req: Request, res: Response) => {
            const newLookbook = new Lookbook({
                name: req.body.lookbook.name,
                image: req.body.lookbook.image,
                description: req.body.lookbook.description,
            })
            newLookbook.save().then((lookbook) => {
                res.status(200).json({
                    response: "Lookbook added"
                })
            }).catch((error) => {
                res.json(error)
            });
        });

        router.get('/lookbooks', this.guard, (req: Request, res: Response) => {
            Lookbook.find().then((lookbooks) => {
                res.json({response: lookbooks.map((t) => t.masked())});
            }).catch((error) => {
                res.json(error)
            });
        });

        router.delete('/lookbooks', this.guard, (req: Request, res: Response) => {
            Lookbook.deleteMany({}).then((lookbooks) => {
                res.status(200).json({
                    response: "Removed all lookbooks"
                })
            }).catch((error) => {
                res.json(error)
            });
        });
    }
}

