import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { VideoInputDto } from '../../../src/videos/dto/video.input-dto';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { AvailableResolutions } from '../../../src/videos/types/video';

describe('Video API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestVideoData: VideoInputDto = {
    title: 'KIRIL',
    author: 'MEFODI',
    canBeDownloaded: true,
    minAgeRestriction: 8,
    createdAt: new Date().toISOString(),
    publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    availableResolutions: [AvailableResolutions.P144],
  };

  beforeAll(async () => {
    await request(app).delete('/testing/all-data').expect(HttpStatus.NoContent);
  });

  it(`should not create video when incorrect body passed; POST /hometask_01/api/videos'`, async () => {
    const invalidDataSet1 = await request(app)
      .post('/videos')
      .send({
        ...correctTestVideoData,
        title: '   ',
        author: '    ',
        canBeDownloaded: null,
        minAgeRestriction: false,
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post('/videos')
      .send({
        ...correctTestVideoData,
        title: '   ',
        author: '    ',
        canBeDownloaded: null,
        minAgeRestriction: false,
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post('/videos')
      .send({
        ...correctTestVideoData,
        title: 'A', // too shot
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(2);

    // check что никто не создался
    const videoListResponse = await request(app).get('/videos');
    expect(videoListResponse.body).toHaveLength(0);
  });

  it('should not update video when incorrect data passed; PUT /api/videos/:id', async () => {
    const {
      body: { id: createdVideoId },
    } = await request(app)
      .post('/videos')
      .send({ ...correctTestVideoData })
      .expect(HttpStatus.Created);

    const invalidDataSet1 = await request(app)
      .put(`/videos/${createdVideoId}`)
      .send({
        ...correctTestVideoData,
        title: '   ',
        author: '    ',
        // canBeDownloaded: null,
        // minAgeRestriction: null,
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(2);

    const invalidDataSet2 = await request(app)
      .put(`/videos/${createdVideoId}`)
      .send({
        ...correctTestVideoData,
        title: '   ',
        author: '    ',
        canBeDownloaded: null,
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(3);

    const invalidDataSet3 = await request(app)
      .put(`/videos/${createdVideoId}`)
      .send({
        ...correctTestVideoData,
        title: 'A', //too short
        canBeDownloaded: null,
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(3);

    const videoResponse = await request(app).get(`/videos/${createdVideoId}`);

    expect(videoResponse.body).toEqual({
      ...correctTestVideoData,
      canBeDownloaded: false,
      minAgeRestriction: null,
      id: createdVideoId,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
    });
  });

  it('should not update video when incorrect features passed; PUT /hometask_01/api/videos/:id', async () => {
    const {
      body: { id: createdVideoId },
    } = await request(app)
      .post('/videos')
      .send({ ...correctTestVideoData })
      .expect(HttpStatus.Created);

    await request(app)
      .put(`/videos/${createdVideoId}`)
      .send({
        ...correctTestVideoData,
        availableResolutions: [
          AvailableResolutions.P360,
          'invalid-feature',
          AvailableResolutions.P240,
        ],
      })
      .expect(HttpStatus.BadRequest);

    const videoResponse = await request(app).get(`/videos/${createdVideoId}`);

    expect(videoResponse.body).toEqual({
      ...correctTestVideoData,
      canBeDownloaded: false,
      minAgeRestriction: null,
      id: createdVideoId,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
    });
  });
});
