export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  owner: Owner;
}

export interface Owner {
  name: string;
  email: string;
}

export interface EventData {
  id: string;
  title: string;
  location: string;
  description: string;
  date: string;
}

export interface RSVP {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}
