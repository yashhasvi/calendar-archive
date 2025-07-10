export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  photoURL?: string;
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  description?: string;
  category: string;
  country?: string;
  isPersonal: boolean;
  userId?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  topCountries: { country: string; count: number }[];
  recentUsers: User[];
  popularEvents: { event: string; searches: number }[];
}