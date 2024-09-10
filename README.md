# MREN Fullstack PriceNotes Managing Web Application

## Project Overview

This web application is based on the study from video tutorial https://www.youtube.com/watch?v=FcxjCPeicvU made by Code in Flow.
BUT with multiple my own custom features, routes, testing and refactoring of his code especially in the front end React component.
Watch the 10 min demo for summary: links to youtube.com

The features section will show you my understanding of the project and knowledge in web application.

## Features

- **USER Interface && Authentication**: View current housing and rental prices.
 pictures

 When user logged in the front end will try to fetch all the prices notes by sending request to the back end server.
 Then the server will authenticate the user session id to check whether it is expired or not Through the backend/middleware/auth.ts
 and it is defined in the backend server routes to process the authentication middleware before any requests related to the prices notes database to protect users notes.
 
 If the session is valid then it will filter the prices notes that match the user id and sending the price notes and successful stautus response back to the client side. Moreover because all the fetching prices notes are asynchronous it will exectue other fucntions before the price notes is fetched increasing the performance.

 Meanwhile, the update and delete functionality of the price note is act similarly. And if user refresh the page the browser will store the session id in cookies so user don't need to login again which promote user experiences.

 pictures for async.

- **Custom Features and Differences to the video tutorial**:

   - Testing & CI workflow: 

      Test cases that cover Unit tests and integration tests and have high coverage of the error handling and functionality. 
   These code don't rely on the active server instead it uses supertest agent to handle requests and responses and monogoMemoryServer to handle the database so that the testing won't affect the actual production database. Moreover, another important feature is this support a CI workflow in Github for testing and linting while maintaining validator for backend environments variables by providing different middleware to server base on the current NodeJS environment variables.

   - Frontend routes and UI for login and sign up user:

      Instead of using the Code In Flow written navigation components that separate to loggedinViewNavComponent and notLoggedinViewNavComponent. I used the React hook to provide cleaner and more maintainable code by setting a useEffect
      to render the navigation component every time the user is changed where the user is getting from the ContextProvider settings
      at the App component. Hence the navigation component will list different navigation items in different states without duplicate our code.

      Moreoever, I added the routes for login and sign with open source UI from Material UI sign in and sign up template. I modified them to fix the purpose of sending validate form data and request data to the backend for authentication. Whereas, in the original video tutorial it was using simple modal to login and sign up which can leads to weaker user experience. 

   - 


- **Clean and Maintainable project structure**:
project-root/
├── backend/
│   ├── @types/
│   ├── config/
│   ├── coverage/
│   ├── dist/
│   ├── models/
│   ├── node_modules/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.ts
│   │   ├── index.ts
│   │   └── priceProcessing.ts
│   ├── tests/
|
└── frontend/
    ├── @types/
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── context/
    │   ├── errors/
    │   ├── models/
    │   ├── network/
    │   ├── pages/
    │   ├── styles/
    │   ├── utils/
    │   ├── App.test.js
    │   ├── App.tsx
    │   ├── index.tsx
    │   ├── logo.svg
    └── .env


## Technology Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Sessions and Cookie
- **Deployment**: No Going to deploy.


### License
This project is licensed under the MIT License. See the LICENSE file for details.