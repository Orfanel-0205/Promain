export type RhuLocation = 'RHU1' | 'RHU2';
export type TimeBlock = 'AM' | 'PM';
export type ServiceType =
  | 'consultation'
  | 'vaccination'
  | 'immunization'
  | 'feeding'
  | 'family_planning'
  | 'prenatal'
  | 'other';

export type Appointment = {
  id: string;
  userId: string;
  serviceType: ServiceType;
  preferredDate: string;
  timeBlock: TimeBlock;
  rhuLocation: RhuLocation;
  symptomsOrReason?: string;
  queueNumber: string;
  qrCodeData?: string;
  status: 'scheduled' | 'in_queue' | 'served' | 'cancelled' | 'no_show';
  createdAt: string;
  updatedAt: string;
};

export type CreateAppointmentInput = {
  serviceType: ServiceType;
  preferredDate: string;
  timeBlock: TimeBlock;
  rhuLocation: RhuLocation;
  symptomsOrReason?: string;
};
