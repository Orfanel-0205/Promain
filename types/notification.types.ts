export type Announcement = {
  id: string;
  title: string;
  titleFil: string;
  body: string;
  bodyFil: string;
  type: 'announcement' | 'health_tip' | 'video';
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
};
