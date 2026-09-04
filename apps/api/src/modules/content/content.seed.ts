import type { AnalyticsPlatform, ContentType } from '@creator-hub/types';
import { isoDaysAgo, seededSeries } from '../../common/mock.util';
import { ContentItemEntity } from './content-item.entity';
import { ContentDailyStatEntity } from './content-daily-stat.entity';

/**
 * Well-known, freely-hosted Creative Commons demo clips (Blender Foundation open movies
 * and Google's public sample-media bucket) — used only as stand-in "video" media for the
 * seeded dashboard, not as real creator content.
 */
const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
];

const TITLES: Record<AnalyticsPlatform, string[]> = {
  youtube: [
    'How I Grew 100K Subscribers in 90 Days',
    'My Complete Camera & Lighting Setup',
    'I Tried Every Editing Software So You Don’t Have To',
    'The Truth About Brand Deals Nobody Tells You',
    'Ranking Every Microphone I Own',
    'Answering Your Most Asked Questions',
    'What $10,000 of Gear Actually Gets You',
    'A Day in My Life as a Full-Time Creator',
    'Reacting to My First Ever Upload',
    'The Algorithm Change That Hurt My Channel',
    '5 Tools That Doubled My Output',
    'Behind the Scenes of My Studio Rebuild',
    'Why I Turned Down a $20K Sponsorship',
    'My Honest Year-One Income Report',
  ],
  instagram: [
    'Reel: Behind the scenes of my studio',
    'Carousel: 5 lessons from my first brand deal',
    'Reel: Get ready with me for a shoot day',
    'Story highlight: Q&A round-up',
    'Reel: My morning routine as a creator',
    'Carousel: Before & after my rebrand',
    'Reel: Trying a trending audio',
    'Post: Announcing a new collab',
    'Reel: Packing for a brand trip',
    'Carousel: Gear I actually use',
    'Reel: 24 hours at a creator meetup',
    'Story highlight: Ask me anything',
  ],
  facebook_page: [
    'Post: Q&A livestream recap',
    'Video: Weekly highlights compilation',
    'Post: Behind the scenes photo dump',
    'Video: Responding to comments',
    'Post: Announcing a giveaway',
    'Video: Studio tour',
    'Post: Milestone celebration',
    'Video: Collab announcement',
    'Post: Fan appreciation roundup',
    'Video: Unboxing live',
  ],
  tiktok: [
    'POV: You finally hit your first brand deal',
    'Rating my own content from 2022',
    'Storytime: How I got my first 1M views',
    'Duet this if you are a creator too',
    'The gear that changed my whole workflow',
    'Answering the question everyone asks',
    'Trying the trend before it dies',
    'What nobody tells you about going viral',
    'Green screen: my rate card explained',
    'Text on screen: my income breakdown',
    'POV: the DM that changed everything',
    'Stitch this with your creator origin story',
    'Day in the life: shoot day chaos',
    'Reading my own comments out loud',
  ],
};

const CONTENT_TYPE_BY_PLATFORM: Record<AnalyticsPlatform, ContentType[]> = {
  youtube: ['video', 'video', 'video', 'short'],
  instagram: ['reel', 'reel', 'post', 'story'],
  facebook_page: ['post', 'video'],
  tiktok: ['short', 'short', 'video'],
};

function durationFor(type: ContentType, seed: number): number | undefined {
  if (type === 'post' || type === 'image' || type === 'story') return undefined;
  if (type === 'short' || type === 'reel') return seededSeries(seed, 1, 12, 90)[0];
  return seededSeries(seed, 1, 180, 1_200)[0];
}

/** Peaks a couple of days after publish, then tapers — never fully flatlines. */
function decayCurve(daysSincePublish: number): number {
  const peak = 2;
  return Math.max(0.06, Math.exp(-Math.abs(daysSincePublish - peak) / 7));
}

const TRAILING_WINDOW_DAYS = 45;

export function buildContentSeed(): { items: ContentItemEntity[]; stats: ContentDailyStatEntity[] } {
  const items: ContentItemEntity[] = [];
  const stats: ContentDailyStatEntity[] = [];
  const platforms: AnalyticsPlatform[] = ['youtube', 'instagram', 'facebook_page', 'tiktok'];
  let seedBase = 1000;

  for (const platform of platforms) {
    const titles = TITLES[platform];
    const types = CONTENT_TYPE_BY_PLATFORM[platform];

    titles.forEach((title, i) => {
      const id = `content-${platform}-${i + 1}`;
      const type = types[i % types.length];
      const publishedDaysAgo = 8 + i * 4 + seededSeries(seedBase, 1, 0, 5)[0];
      const publishedAt = isoDaysAgo(publishedDaysAgo);
      const isVideoLike = type === 'video' || type === 'short' || type === 'reel';
      const viralRecent = i % 4 === 0;

      items.push({
        id,
        platform,
        contentType: type,
        title,
        thumbnailUrl: `https://picsum.photos/seed/${platform}-${i + 1}/480/270`,
        mediaUrl: isVideoLike ? SAMPLE_VIDEOS[(seedBase + i) % SAMPLE_VIDEOS.length] : undefined,
        publishedAt,
        durationSeconds: durationFor(type, seedBase + 1),
        retentionPct: seededSeries(seedBase + 2, 1, 32, 82)[0],
      } as ContentItemEntity);

      const publishedDate = new Date(publishedAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let offset = TRAILING_WINDOW_DAYS - 1; offset >= 0; offset--) {
        const date = new Date(today);
        date.setDate(date.getDate() - offset);
        if (date < publishedDate) continue;

        const daysSincePublish = Math.round((date.getTime() - publishedDate.getTime()) / 86_400_000);
        const curve = decayCurve(daysSincePublish);
        const daySeed = seedBase + offset;
        let views = Math.round(seededSeries(daySeed, 1, 400, 7_000)[0] * curve);
        if (viralRecent && offset <= 6) views = Math.round(views * 3.2);

        const engagementFactor = seededSeries(daySeed + 500, 1, 4, 12)[0] / 100;
        const likes = Math.round(views * engagementFactor);
        const comments = Math.round(likes * 0.08);
        const shares = Math.round(likes * 0.15);
        const saves = Math.round(likes * 0.2);
        const revenue = Math.round(views * (seededSeries(daySeed + 900, 1, 2, 8)[0] / 1000));

        stats.push({
          contentItemId: id,
          date: date.toISOString().slice(0, 10),
          views,
          likes,
          comments,
          shares,
          saves,
          revenue,
        } as ContentDailyStatEntity);
      }

      seedBase += 37;
    });
  }

  return { items, stats };
}
