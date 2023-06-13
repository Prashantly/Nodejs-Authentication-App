
# Nodejs Authentication Appplication

This is a user authentication application built with Node.js. It provides features such as user sign-up, sign-in, sign-out, password reset, and social authentication using Google. The application stores passwords in encrypted form and includes additional features like password strength validation, email notifications, and reCAPTCHA integration for enhanced security.


## Features

* User Sign-up: Users can create an account by providing their email address and password.

* User Sign-in: Existing users can sign in with their email and password.

* User Sign-out: Signed-in users can sign out of their account.

* Password Reset: Signed-in users can reset their password by providing the current password and setting a new password.

* Encrypted Passwords: User passwords are stored in the database in encrypted form to ensure security.

* Google Login/Signup: Users have the option to sign up or sign in using their Google account.

* Forgot Password: Users can request a password reset through email. user will receive reset password link to their provided eamil address and expires in some time(15m).

* Password Validation: The application validates passwords during sign-up to ensure they meet certain criteria

* Error Notifications: Users receive notifications for various error scenarios, such as unmatching passwords during sign-up or incorrect password during sign-in.

* reCAPTCHA Integration (Extra Points): The sign-up and sign-in pages include reCAPTCHA to prevent automated bots from accessing the application.
## Installation

1) Clone the repository:
    
   git clone https://github.com/Prashantly/Nodejs-Authentication-App.git

2) Install the dependencies:
     
     cd user-authentication-app
     npm install
## Usage

1) Set up the necessary environment variables. Refer to the Configuration section for details.

2) Start the application:
 
       npm start

3) Access the application in your web browser at http://localhost:8000.
## Configuration

* PORT : Give Port number in which your local express server running
* MONGO_URL : The connection URI for your MongoDB database.
* EMAIL : email address for the SMTP service.
* PASSWORD : Password for the SMTP service.
* JWT_SECRET : Give Secret key for sending password link
* SESSION_SECRET : Give secret key for session

#### Google details for signup/login

* CONFIGURE_GOOGLE_CLIENT_ID : google client id 
* CONFIGURE_GOOGLE_CLIENT_SECRET: google client secret

* GOOGLE_CALLBACK_URL : callback url provided in while setting up in google developer console
## Dependencies

* bcrypt
* body-parser
* connect-flash
* connect-mongo
* cookie-parser
* crypto
* dotenv
* ejs
* express
* express-ejs-layouts
* express-session
* jsonwebtoken
* mailgen
* mongoose
* nodemailer
* nodemon
* passport
* passport-google-oauth20
* passport-local
## Contributing

* Contributions to this project are welcome. If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.


## License

This project is licensed under the MIT License.
