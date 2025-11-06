// src/types.ts

export interface Comment {
  _id: string;
  user: { _id: string; name: string };
  text: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  author: { _id: string; name: string; email: string };
  text: string;
  imageUrl?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  imageUrl?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}


