export type QueueStatus = {
  appointmentId: string;
  queueNumber: string;
  nowServing: string;
  estimatedWaitMinutes: number;
  priorityStatus: 'senior' | 'pwd' | 'pregnant' | 'regular';
  serviceType: string;
  rhuLocation: string;
  isNext: boolean;
  totalInQueue: number;
};
