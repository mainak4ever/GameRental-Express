# Game Rental Backend

Welcome to the Game Rental Backend repository! This backend application is designed to facilitate game rentals for both gamers and sellers. Below, you'll find information on the features, APIs, and data storage used in this project.

## Application Details

- _Backend Technologies_: Node, Express, MongoDB
- _Frontend_: No frontend implementation (backend only)
- _End-Users_: Gamers, Sellers

## Postman Collection

- \*For testing the APIs, you can use the [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/29328925-abfed150-26c1-466e-a048-05cafe9ec458?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D29328925-abfed150-26c1-466e-a048-05cafe9ec458%26entityType%3Dcollection%26workspaceId%3Ded4f1f64-4b2b-445c-8f64-35a46a7b3a73) provided.

1. [Download Postman](https://www.postman.com/downloads/) if you haven't already.

## Application Features

### Common Functionalities

#### Login

- _Method_: POST
- _Request Data_: { "username": "abc", "password": "abc@123" }
- _Response Data (Success)_: { "userId": 12, "message": "Login Successful" }
- _Response Data (Failure)_: { "status": 400, "message": "Invalid Login Credentials" }

#### Register

- _Method_: POST
- _Request Data_: { "username": "", "email": "", "password": "", "firstName": "", "lastName": "", "contactNumber": "", "userType": "" }
- _Response Data (Success)_: { "userId": "", "username": "", "email": "", "password": "", "firstName": "", "lastName": "", "contactNumber": "", "userType": "" }
- _Response Data (Failure)_: { "status": 400, "message": "Please provide email" }

#### Homepage API

- _Method_: GET
- _Request Data_: None
- _Response Data_: Array of products with minimal details

#### Product Details

- _Method_: GET
- _Request Data_: { "productID": 123 }
- _Response Data (Success)_: Product details object
- _Response Data (Failure)_: { "status": 404, "message": "Product Not Found" }

#### Save/Remove from Wishlist

- _Method_: PUT
- _Request Data_: { "userID": 1, "productID": 123 }
- _Response Data (Success)_: Array of wishlist products
- _Response Data (Failure)_: { "status": 404, "message": "Error Message" }

#### Add/Remove from Cart

- _Method_: PUT
- _Request Data_: { "userID": 1, "productID": 123, "count": 2, "bookingStartDate": "2024-01-01", "bookingEndDate": "2024-01-07" }
- _Response Data (Success)_: Array of cart products
- _Response Data (Failure)_: { "status": 400, "message": "Only 4 units available" }

#### Place Order

- _Method_: POST
- _Request Data_: { "userID": 1 }
- _Response Data (Success)_: Array of ordered products
- _Response Data (Failure)_: { "status": 404, "message": "Error Message" }

#### View User Details

- _Method_: GET
- _Request Data_: { "username": "qaifi" }
- _Response Data (Success)_: User details object
- _Response Data (Failure)_: { "status": 404, "message": "Error Message" }

#### Update User Details

- _Method_: PUT
- _Request Data_: { "userID": 1, "firstName": "John", "lastName": "Doe", "email": "john.doe@example.com", "contactNumber": "1234567890", "userType": "Gamer" }
- _Response Data (Success)_: Updated user details object
- _Response Data (Failure)_: { "status": 404, "message": "Error Message" }

### Seller Functionalities

#### Create Product

- _Method_: POST
- _Request Data_: { "title": "Game Title", "thumbnailURL": "url", "sellerUsername": "seller", "unitsAvailable": 10, "productType": "game", "productImages": [], "rentalPricePerWeek": 50, "rentalPricePerMonth": 150 }
- _Response Data (Success)_: Created product details
- _Response Data (Failure)_: { "status": 400, "message": "Error Message" }

#### Update Product

- _Method_: PUT
- _Request Data_: { "productID": 123, "title": "Updated Title", "thumbnailURL": "updated_url", "sellerUsername": "seller", "unitsAvailable": 8, "productType": "game", "productImages": [], "rentalPricePerWeek": 60, "rentalPricePerMonth": 180 }
- _Response Data (Success)_: Updated product details
- _Response Data (Failure)_: { "status": 400, "message": "Error Message" }

## Data Storage

- Create a new FREE cluster on MongoDB Cloud (Atlas).
- Set the cluster URL in the DATABASE_URL constant in the database.js file.

Feel free to explore and contribute to this backend application for a seamless gaming experience!
