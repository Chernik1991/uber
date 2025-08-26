import express, { Express, Request, Response } from 'express';
import { testingRouter } from './testing/routers/testing.router';
import { setupSwagger } from './core/swagger/setup-swagger';
import { videosRouter } from './videos/routers/videos.router';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('hello world!!!');
  });

  app.use('/videos', videosRouter);
  app.use('/testing', testingRouter);

  setupSwagger(app);
  return app;
};
