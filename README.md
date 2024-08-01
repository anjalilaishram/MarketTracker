# MarketTracker

MarketTracker is a dynamic and efficient platform designed to monitor and display real-time price data for stocks and cryptocurrencies. By leveraging advanced technologies and APIs, MarketTracker provides users with up-to-date market information in an easy-to-use interface.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup MongoDB and Redis](#setup-mongodb-and-redis)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## Features

- Real-time price updates from Binance
- Historical data fetching for 1-second intervals
- Interactive TradingView chart integration
- Symbol management with search, pagination, and sorting
- WebSocket connections for live updates
- Efficient data caching with Redis

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Redis, BullMQ
- **Frontend**: Next.js, React, Redux, Material-UI, Lightweight-Charts
- **WebSockets**: Binance WebSocket API
- **Logging**: Winston
- **Task Queue**: BullMQ

## Setup MongoDB and Redis

1. **MongoDB**: Follow the official [MongoDB installation guide](https://docs.mongodb.com/manual/installation/) for your operating system.
2. **Redis**: Follow the official [Redis installation guide](https://redis.io/download) for your operating system.

## Setup and Installation

### Prerequisites

- Node.js (>=14.x)
- MongoDB
- Redis
- npm or yarn

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/anjalilaishram/MarketTracker.git
   cd MarketTracker/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and set the necessary environment variables:

   ```bash
   BINANCE_API_BASE_URL=https://api.binance.com
   BINANCE_WS_URL=wss://stream.binance.com:9443/ws
   MONGODB_URI=mongodb://localhost:27017/market_tracker
   REDIS_HOST=localhost
   REDIS_PORT=6379
   PORT=5000
   ```

4. Run database migrations:

   ```bash
   npm run migrate
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the `frontend` directory and set the necessary environment variables:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Use the symbol manager to track or untrack symbols.
3. View real-time and historical data on the TradingView chart.

## Project Structure

```
MarketTracker/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── migrations/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── server.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── redux/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── pages/
│   │   ├── public/
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.local
│
├── README.md
```

## Scripts

### Backend

- `npm start`: Start the backend server
- `npm run migrate`: Run database migrations

### Frontend

- `npm run dev`: Start the frontend development server
- `npm run build`: Build the frontend for production
- `npm start`: Start the production server

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
