# Hangman Game API

#### A multiplayer hangman game made using NestJs, Postgres and Prisma ORM, that enables users to register, create rooms and play the famous Hangman game with their friends!

Tech Stack

 - Node.js
 - Typescript
 - NestJS Framework
 - Postgres
 - Prisma ORM
 - Websockets (Socket.io)
 - JWT Tokens
 - Swagger (API Documentation)

##### Bonus Feature - Multiple games/rooms can be created and played at the same time!

### How to setup
Pre-requisites to be installed on your system

 - Node.js
 - Postgres
 - NestJS CLI 
	 - Install using `npm install -g @nestjs/cli`
### Setup Instructions
 - run command`npm install`
 - for env setup, copy the .env.example file and create a .env file of the same type
	 - DATABASE_URL=`"postgresql://username:password@localhost:5432/hangman?schema=public"`, here add your db username, password and url for your postgres database
	 - JWT_SECRET=`"ENTER_ANY_JWT_SECRET_HERE"` , here enter any JWT SECRET key for the JWT Tokens used in the app
 - run `npx prisma migrate dev`  to apply migrations to database
 - run `npx prisma generate` to generate prisma client
 - In `hangman-api\src\constants\constants.ts` file, you can change the number of lives each player can have per round. Default value is 6.








### Design 
Used NestJS framework due to its easy development curve, scalability and ability to natively integrate Typescript for type safety features.
 
 ### Key technological designs
 

 - User data is registered and stored in the database to enable users to login and save their created rooms so that they can use it again.
 - Each game data is stored in memory so that DB calls are to a minimum and most data is available quickly and efficiently. The reason for this is that after a game has ended, there was no need to store any game related data.
 - Once game is ended, the game data is removed from the memory, but room information is saved in the database so the user can use the same room again. 
 - Game data is broadcasted to all  players in a particular room with the help of WebSockets. Data like user joined room, user left room, game started, game ended, round started, round ended, words to guess, correct guesses and wrong guesses by a player, full word guess and subsequent points are sent in real time to the client.
 - On every action like the above mentioned, events are emitted to respective rooms so that only those players can access those broadcasted information.

### Key Services
1. User service - deals with logic to register and login user
2. Room Service - deals with logic to create, delete, join, exit or fetch score details of the players in the room
3. Round service - deals with logic to start and end games and rounds, manage current word master (player who will determine the word to be guessed), and generate the current word to be guessed along with its length and hints for the other players
4. Guess service - deals with logic to enable players to guess letters of the word
5. Gateway service - deals with websocket logic of the app. Has a message subscriber that listens to a `joinRoom` message which denotes that the player has joined a particular room.
6. Guard - Authentication guard, to determine if the user is logged in or not.
7. Prisma service - Contains instance of the prisma client that is accessible in the app where the Prisma instance is instantiated. 
8. Player service - not accessible via any route, but has actions to create a player. 

*Helper functions are used wherever possible so that the code remains clean and reusable.*


### How to test
 - Create users using the /user POST request
 - Login using the /user/login POST route, this sends back a JWT token which should be used in the Authorization header as a bearer token, eg - Bearer JWT_TOKEN (note: JWT Tokens expire in 3h, this can be changed by going to `hangman-api\src\user\user.module.ts` and changing the expiresIn value in the JWTModule.registers method)
 - Create a room using /room POST request, room can also have a password
 - Join a room using /room/join-room/:roomHash POST request
 - Once room is joined, create a socket.io request in a different tab and add following events and enable them to listen for these events (do this for every user/connected client)
	 - userJoined
	 - leaveRoom
	 - gameStarted
	 - gameEnded
	 - startedRound
	 - endedRound	
	 - nextWordSetter
	 - letterGuessed
	 - letterMissed
	 - wordGuessed
	 - wordGenerated
		 - Once these are added, send a message with the format `{"username":  "player1", "roomHash":  "ACX-XOQ-VZB"}`, to the `joinRoom` listener. This will add the player to the given roomHash and then the player can listen to all events for that room
 - Start a game using /round/start-game/:roomHash POST request (can be done by round creator)
 - Start a round using /round/start-round/:roomHash POST request (can be done by round creator)
 - Generate a word using /round/generate-word/:roomHash POST request (can be accessed only by the current word master)
 - End a round by /round/end-current-round/:roomHash POST request (can be done by only round creator), can also be used to end the game by passing `endGame: true` in the request body
 - Make a guess by /guess/:roomHash POST request

##### The Swagger documentation can be found at `http://localhost:3000/api#/` 
The Postman Collection will be in the repository for testing.


