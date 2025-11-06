🧑‍💼 LinkedIn Clone – Full Stack Social Media App

A modern LinkedIn-style social media platform built with React + TypeScript + Node.js + MongoDB, where users can sign up, log in, create posts (with text or images), like, comment, and view posts from all users — in real time.

🌐 Live Demo

🖥️ Frontend (Vercel): https://linkedclone-mu.vercel.app

⚙️ Backend (Render): https://linkedclone-a9n0.onrender.com

💾 GitHub Repository: https://github.com/ankittrip/linkedclone

🚀 Tech Stack
🖥️ Frontend (React + TypeScript)

React 19 (Vite)

TypeScript

Tailwind CSS

React Router DOM

Axios

Socket.io Client

Lucide React Icons

Date-fns

⚙️ Backend (Node.js + Express)

Node.js + Express.js

MongoDB + Mongoose

JWT Authentication

Multer (File Upload)

Cloudinary (Image Storage)

Socket.io (Real-time communication)

CORS, Morgan, Dotenv

✨ Key Features

✅ Secure User Signup & Login (JWT Authentication)
✅ Create, Edit & Delete Posts
✅ Upload Images with Posts (via Cloudinary)
✅ Like & Comment on Posts
✅ Real-Time Updates using Socket.io
✅ Responsive Modern UI using TailwindCSS
✅ Clean Folder Structure & Type-Safe Frontend (TypeScript)

📂 Folder Structure
linkedin-clone/
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   └── post.model.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── server.js
│   ├── .env
│   ├── package.json
│
└── frontend/
    ├── src/
    ├── public/
    ├── tsconfig.json
    ├── package.json
    └── vite.config.ts

⚙️ Installation Guide
🔧 Backend Setup
cd backend
npm install


Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


Run the backend server:

npm run dev


➡️ Backend runs at http://localhost:5000

💻 Frontend Setup
cd frontend
npm install


Create a .env file:

VITE_API_URL=http://localhost:5000


Run the frontend app:

npm run dev


➡️ Frontend runs at http://localhost:5173

🧪 API Endpoints
Method	Endpoint	Description
POST	/api/auth/signup	Register new user
POST	/api/auth/login	Login existing user
GET	/api/posts	Get all posts
POST	/api/posts	Create new post
PUT	/api/posts/:id	Edit post
DELETE	/api/posts/:id	Delete post
POST	/api/posts/:id/like	Like/Unlike post
POST	/api/posts/:id/comment	Add comment

🖼️ Screenshots



Login Page
<img width="550" height="350" alt="image" src="https://github.com/user-attachments/assets/1863f8eb-87d4-49a5-acee-0b5fa0ed1ff7" />


Feed Page
<img width="550" height="350" alt="image" src="https://github.com/user-attachments/assets/48b83594-ae49-4f4e-9f46-8c24f6118be3" />

Create Post
<img width="550" height="350" alt="image" src="https://github.com/user-attachments/assets/3ce41a0c-eff8-49f1-962b-e29da1945193" />


profile page
<img width="550" height="350" alt="image" src="https://github.com/user-attachments/assets/0a39414a-9730-44a6-856e-63938bfd88ca" />

	


🚀 Deployment

Frontend: Deployed on Vercel

Backend: Deployed on Render

Database: Hosted on MongoDB Atlas

👨‍💻 Author

Ankit Tripathi
Full Stack Developer (MERN + TypeScript)
📧 ankittripathi559@gmail.com

🔗 GitHub: https://github.com/ankittrip

🌍 Live Project: LinkedIn Clone App

📜 License

This project is licensed under the ISC License.

🚧 Future Enhancements

Add user connections (follow/friend system)

Add profile picture & bio section

Implement notifications & real-time comments

Improve UI animations and loading states
