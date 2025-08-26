import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { VideoInputDto } from '../../../src/videos/dto/video.input-dto';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { AvailableResolutions } from '../../../src/videos/types/video';

describe('Video API', () => {
  const app = express();
  setupApp(app);

  const testVideoData: VideoInputDto = {
    title: 'KIRIL',
    author: 'MEFODI',
    canBeDownloaded: true,
    minAgeRestriction: 8,
    createdAt: new Date().toISOString(),
    publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    availableResolutions: [AvailableResolutions.P144],
  };

  beforeAll(async () => {
    await request(app)
      .delete('/hometask_01/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  it('should create driver; POST /hometask_01/api/videos', async () => {
    const newVideo: VideoInputDto = {
      ...testVideoData,
      title: 'KIRIL',
    };

    await request(app)
      .post('/hometask_01/api/videos')
      .send(newVideo)
      .expect(HttpStatus.Created);
  });

  it('should return videos list; GET /hometask_01/api/videos', async () => {
    await request(app)
      .post('/hometask_01/api/videos')
      .send({ ...testVideoData, name: 'Another Video' })
      .expect(HttpStatus.Created);

    await request(app)
      .post('/hometask_01/api/videos')
      .send({ ...testVideoData, name: 'Another Video2' })
      .expect(HttpStatus.Created);

    const videoListResponse = await request(app)
      .get('/hometask_01/api/videos')
      .expect(HttpStatus.Ok);

    expect(videoListResponse.body).toBeInstanceOf(Array);
    expect(videoListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should return driver by id; GET /hometask_01/api/videos/:id', async () => {
    const createResponse = await request(app)
      .post('/hometask_01/api/videos')
      .send({ ...testVideoData, name: 'Another Video' })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`/hometask_01/api/videos/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  it('should update driver; PUT /hometask_01/api/videos/:id', async () => {
    const createResponse = await request(app)
      .post('/hometask_01/api/videos')
      .send({ ...testVideoData, name: 'Another Video' })
      .expect(HttpStatus.Created);

    const videoUpdateData: VideoInputDto = {
      title: 'KIRIL',
      author: 'MEFODI',
      canBeDownloaded: true,
      minAgeRestriction: 8,
      createdAt: new Date().toISOString(),
      publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      availableResolutions: [AvailableResolutions.P144],
    };

    await request(app)
      .put(`/hometask_01/api/videos/${createResponse.body.id}`)
      .send(videoUpdateData)
      .expect(HttpStatus.NoContent);

    const videoResponse = await request(app).get(
      `/hometask_01/api/videos/${createResponse.body.id}`,
    );

    expect(videoResponse.body).toEqual({
      ...videoUpdateData,
      id: createResponse.body.id,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
    });
  });

  it('DELETE /hometask_01/api/videos/:id and check after NOT FOUND', async () => {
    const {
      body: { id: createdVideoId },
    } = await request(app)
      .post('/hometask_01/api/videos')
      .send({ ...testVideoData, name: 'Another Video' })
      .expect(HttpStatus.Created);

    await request(app)
      .delete(`/hometask_01/api/videos/${createdVideoId}`)
      .expect(HttpStatus.NoContent);

    const videoResponse = await request(app).get(
      `/hometask_01/api/videos/${createdVideoId}`,
    );
    expect(videoResponse.status).toBe(HttpStatus.NotFound);
  });
});
