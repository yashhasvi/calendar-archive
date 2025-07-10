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
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
}