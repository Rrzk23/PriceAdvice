# MREN Fullstack PriceNotes Managing Web Application

 ## Technology Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Sessions and Cookie
- **Deployment**: No Going to deploy.

## Project Overview

This web application is based on the study from a video tutorial https://www.youtube.com/watch?v=FcxjCPeicvU made by Code in Flow.
BUT with multiple my own custom features, routes, testing and refactoring of his code especially in the front end React component.
Watch the 10 min demo for summary: links to youtube.com.


The features section will show you my understanding of the project and knowledge in web application.

## Features

- **USER Interface && Authentication**:

 ![Screenshot 2024-09-10 153818](https://github.com/user-attachments/assets/d21261c2-3ccc-4c9d-88fb-eb50a7d8dfd2)

![Screenshot 2024-09-10 153909](https://github.com/user-attachments/assets/e37d9ab8-ae42-46a1-a18d-8cb2ffa50973)

 When a user is logged in the front end will try to fetch all the prices notes by sending requests to the backend server. Then the server will authenticate the user session id to check whether it is expired or not Through the backend/middleware/auth.ts
 and it is defined in the backend server routes to process the authentication middleware before any requests related to the prices notes database to protect users notes.
 
 If the session is valid then it will filter the price notes that match the user id and send the price notes and successful status response back to the client side. Moreover because all the fetching prices notes are asynchronous it will execute other functions before the price notes are fetched increasing the performance.

 Meanwhile, the update and delete functionality of the price note acts similarly. And if a user refreshes the page the browser will store the session id in cookies so users don't need to login again which promotes user experiences.


 ![Screenshot 2024-09-10 155844](https://github.com/user-attachments/assets/9cbbd741-5a36-49e8-bffe-0a6701ac8e4d)


- **Custom Features and Differences to the video tutorial**:

   - **Testing** & **CI** workflow: 

Test cases that cover Unit tests and integration tests and have high coverage of the error handling and functionality. This code doesn't rely on the active server, instead it uses supertest agent to handle requests and responses and monogoMemoryServer to handle the database so that the testing won't affect the actual production database. Moreover, another important feature is this support a CI workflow in Github for testing and linting while maintaining a validator for backend environments variables by providing different middleware to server base on the current NodeJS environment variables.

![image](https://github.com/user-attachments/assets/c531d715-f3d6-400f-91c2-135b07edcfed)


   - **Frontend routes** and UI for login and sign up user:

      Instead of using the Code In Flow written UserPriceNotePageComponent components that separate to loggedinViewPriceNotePageComponent and notLoggedinViewPriceNotePageComponent. I used the React hook to provide cleaner and more maintainable code by setting a useEffect to render the UserNotePage component every time when user is changed where the user is getting from the ContextProvider settings at the App component. Hence the UserPriceNotePage component will list different items in different states without duplicating our code.

      Moreover, I added the routes for login and sign with open source UI from Material UI sign in and sign up template. I modified them to fix the purpose of sending validate form data and request data to the backend for authentication. Whereas, in the original video tutorial it was using a simple modal to login and sign up which can lead to weaker user experience.

     Before Login : ![Screenshot 2024-09-10 191706](https://github.com/user-attachments/assets/25327bcf-c29f-4cc3-8784-ec57ee2857b4)
     Login Page :![Screenshot 2024-09-10 191714](https://github.com/user-attachments/assets/27766564-f8c2-4519-a75b-77f4e209a83f)
     Login Page if user type invalid ID: ![Screenshot 2024-09-10 191714](https://github.com/user-attachments/assets/585b9dc5-6087-46db-af9a-e5c2dc9c07c1)
     Signup Page: ![Screenshot 2024-09-10 191721](https://github.com/user-attachments/assets/a3efaac8-8373-4156-a7b2-26aa2b2078ec)
     Adding a Price note and the nav bar showing different list items if Log in: ![Screenshot 2024-09-10 191807](https://github.com/user-attachments/assets/36f09e90-8835-413b-9f97-df7a354b04bd)
 
     Database user password is hashed: ![image](https://github.com/user-attachments/assets/324464f1-6fe7-4330-8c82-d561eb2f82d3)
     Session is stored at MonogoDB too: ![image](https://github.com/user-attachments/assets/38a0a8e3-6916-454c-ae71-3695d5d4a21e)﻿


### License
This project is licensed under the MIT License. See the LICENSE file for details.
