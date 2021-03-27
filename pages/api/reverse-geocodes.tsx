import { NextApiRequest, NextApiResponse } from 'next';
import geocoder from 'local-reverse-geocoder';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            let cords = {
                latitude: parseFloat(req.body.latitude),
                longitude: parseFloat(req.body.longitude),
            };
            const geoCodeResults = await new Promise((resolve, reject) => {
                geocoder.lookUp(cords, function (err, resp) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resp);
                    }
                })
            });
            res.status(200).json(geoCodeResults[0][0]);
            break;
        default:
            res.status(405);
            break;
    }
}
