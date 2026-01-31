export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export type FeedbackInput = {
  appointmentId?: string;
  rating: number;
  option?: 'fast' | 'slow' | 'easy';
  comment?: string;
};
