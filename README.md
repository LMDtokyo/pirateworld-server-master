🌊 PirateWorld Server Master 🌴
PirateWorld Server Master is the powerful backend engine for the PirateWorld game, designed to handle everything from user authentication to game mechanics. Built with modern technologies like TypeScript, Node.js, and Prisma ORM, it provides a robust foundation for your pirate-themed adventures.

⚡️ Features
Authentication: Secure login and registration system.
Game Management: Handles game data and user interactions.
Real-time Updates: Keeps the game world in sync with player actions.
🚀 Getting Started
1. Clone the Repository
```bash
git clone https://github.com/LMDtokyo/pirateworld-server-master.git
cd pirateworld-server-master
```
2. Install Dependencies
```bash
npm install
```
3. Configure Environment Variables
Create a .env file in the root directory with the following:
```bash
ENV=development
HTTP_PORT=5000
SOCKET_PORT=4000
CLIENT_URL=http://localhost:3000
API_URL=http://localhost:5000
JWT_SECRET=your
DATABASE_URL=your
```
4. Run Migrations and Generate Prisma Client
```bash
npx prisma migrate dev --name init
npx prisma generate
```
5. Start the Server
```bash
npm run start
```

Your server will be running at http://localhost:5000.

🌐 API Endpoints
POST /api/auth/signin - User login.
POST /api/auth/signup - User registration.
POST /api/auth/token/refresh - Refresh tokens.
POST /api/auth/token/revoke - Revoke tokens.
GET /api/auth/me - Get user details.
🛠 Technologies
Node.js
TypeScript
Express.js
Prisma ORM
MySQL
📜 License
This project is licensed under the MIT License.

