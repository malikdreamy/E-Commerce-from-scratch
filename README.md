Link: https://malikecommerce.store/

Homepage

<img width="885" alt="Screen Shot 2024-01-20 at 1 03 41 AM" src="https://github.com/malikdreamy/E-Commerce-from-scratch/assets/119153047/79747407-9b74-48b3-9c28-caf8a8522e81">

E-Commerce Website with Enhanced Features
Welcome to my E-Commerce Website repository! This project is designed to provide a comprehensive platform for users to manage products, blogs, and gain insights into visitor analytics. Below is a detailed guide to help you understand the features and set up the application. No Wordpress, No Wix, No Shopify! 100% Javascript and MongoDB created 100% by Malik Tornes. 

Features
1. Product Management
Upload Products: Easily add new products to the catalog with details like name, description, price, and images.
Edit Products: Update product information, pricing, or images effortlessly.

3. Visitor Analytics
Track Visitors: Monitor website traffic by capturing visitor IP addresses, city, and user agent information. These detailed stats also show the first time the user visited, the last time they visited and also every page they visited on the website.
Insightful Analytics: Gain valuable insights into user behavior for strategic decision-making.

5. Blog Management
Create Blogs: Share engaging content by uploading blogs with titles, content, and images.
Edit Blogs: Modify blog content and keep your audience informed.

6. Accept Credit Card & Bitcoin Payments
   Accept payments from all major credit card issuers. Also accept Bitcoin! The Ecommerce site is also hosted over SSL so
   all payments to Square are secure and encrypted.

7. Communiate With Customers
   Easily communiate with customers! A customer can send an email to your email through the Contact Us and it goes straight to any email you choose.
   Get real time questions and comments directly from your customer!

8. Security!
   If someone attempts to login to the Admin page and gets the password wrong more than 5 times the users IP address will automatically be blocked from the page. So if they try to brute force login to the admin panel
   the IP address will be blocked and a Blocked Page will only be rendered to them so they cannot keep trying. Also the IP address stays blocked forever unless the actual Admin removes it,
    so they would not be able to continue trying from their current IP. This makes it difficult for someone to brute force login as they would have to keep changing their IP address every five attempts.
   Test it out :P
   https://malikecommerce.store/admin-login

Technologies Used
Backend: Node.js, Express.js, Cloudinary, EJS, Sendgrid, Square, tryspeed

Database: MongoDB 

Frontend: HTML, CSS, JavaScript

Visitor Analytics: Utilizes a custom solution for capturing and analyzing visitor data.


Product Page
<img width="1064" alt="Screen Shot 2024-01-20 at 1 02 32 AM" src="https://github.com/malikdreamy/E-Commerce-from-scratch/assets/119153047/b03bb432-c4bc-4820-b965-8772569ee51d">

Blog Page
<img width="952" alt="Screen Shot 2024-01-20 at 6 37 14 PM" src="https://github.com/malikdreamy/E-Commerce-from-scratch/assets/119153047/7337d361-0110-4156-bf84-0c9a955dcde3">


Adding To Cart
<img width="1008" alt="Screen Shot 2024-01-20 at 1 02 43 AM" src="https://github.com/malikdreamy/E-Commerce-from-scratch/assets/119153047/0eb67abb-777f-4994-acba-c0e2e807c593">

Viewing All Stats By Country. Below shows how many visitors came from a particular country.
<img width="1094" alt="Screen Shot 2024-01-20 at 6 47 00 PM" src="https://github.com/malikdreamy/E-Commerce-from-scratch/assets/119153047/d1c87233-cdaf-4d38-ad2f-f7cb95cb1b4e">

Viewing Stats By Particular Visitor
<img width="1083" alt="Screen Shot 2024-01-20 at 6 46 51 PM" src="https://github.com/malikdreamy/E-Commerce-from-scratch/assets/119153047/4ad509c1-382e-489c-8640-2eaf7971f377">


Uploading Products
<img width="1441" alt="Screen Shot 2024-01-20 at 12 55 54 AM" src="https://github.com/malikdreamy/E-Commerce-from-scratch/assets/119153047/e522c5ed-f9a4-491d-aba6-6cffe8a7b422">

Uploading Blog
<img width="1630" alt="Screen Shot 2024-01-20 at 1 01 29 AM" src="https://github.com/malikdreamy/E-Commerce-from-scratch/assets/119153047/6c64a8d0-34bf-4704-beb4-b21274fb62f6">

Checkout-Page
<img width="779" alt="Screen Shot 2024-01-20 at 6 45 35 PM" src="https://github.com/malikdreamy/E-Commerce-from-scratch/assets/119153047/4cdfd617-dfcb-42e9-a786-5bb57812a55e">




Setup Instructions
Clone the repository:


git clone git@github.com:malikdreamy/E-Commerce-from-scratch.git
Install dependencies:
npm install

Set up your MongoDB database and update the connection details in the configuration file.

Start the application:
npm run start

Access the application at http://localhost:3000 in your browser.

Configuration
Update the environment variables in a .env file for sensitive information such as database credentials and API keys.
