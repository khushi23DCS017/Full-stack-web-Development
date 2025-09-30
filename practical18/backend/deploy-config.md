# Backend Deployment Configuration for Render

## Environment Variables to Set in Render:

1. **MONGO_URI**: Your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/taskify?retryWrites=true&w=majority`
   - Get this from MongoDB Atlas → Database → Connect → Connect your application

2. **JWT_SECRET**: A strong secret key for JWT tokens
   - Generate a long, random string (at least 32 characters)
   - Example: `your-super-secret-jwt-key-here-make-it-very-long-and-random-12345`

3. **NODE_ENV**: Set to `production`

4. **PORT**: Render will set this automatically (don't set this manually)

## MongoDB Atlas Setup:

1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free M0 cluster
3. Create database user with read/write permissions
4. Whitelist IP `0.0.0.0/0` (allow all IPs)
5. Get connection string and replace `<password>` with your user password

## Render Deployment Steps:

1. Connect GitHub repository
2. Select `backend` folder as root directory
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables listed above
6. Deploy!
