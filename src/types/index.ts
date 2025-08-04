export interface StampPoint {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  qrCode: string;
  category: string;
  address?: string;
  imageUrl?: string;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  registeredAt: Date;
}

export interface UserStamp {
  id: string;
  userId: string;
  stampPointId: string;
  collectedAt: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface StampRally {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  stampPoints: StampPoint[];
  totalStamps: number;
  requiredStamps: number;
  isActive: boolean;
}

export interface AppState {
  user: User | null;
  currentRally: StampRally | null;
  collectedStamps: UserStamp[];
  isLoading: boolean;
  error: string | null;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthError {
  field?: string;
  message: string;
}
