import { AvailableResolutions, Video } from '../videos/types/video';

export const db = {
  videos: <Video[]>[
    {
      id: 1,
      title: 'KIRIL',
      author: 'MEFODI',
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      availableResolutions: [AvailableResolutions.P144],
    },
    {
      id: 2,
      title: 'NOKIR',
      author: 'JENSHEN',
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      availableResolutions: [AvailableResolutions.P240],
    },
    {
      id: 3,
      title: 'MULT',
      author: 'VOLT',
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      availableResolutions: [AvailableResolutions.P360],
    },
  ],
};
