const router = require('express').Router();
require('dotenv').config();
const uniqid = require('uniqid');
const sgMail = require('@sendgrid/mail');
const { Client, Environment, ApiError } = require('square');
const { v4: uuidv4 } = require('uuid');

const client = new Client({
  accessToken: process.env.ACCESS_TOKEN,
  environment: Environment.Production // Use Environment.Production for live transactions
});


  // bitcoin checkout
  //processing is done on client side through payment window
  //this route sends the user and admin order information
  router.post('/bitcoin-checkout', async (req, res)=>{
    try{
    let userEmail = req.body.email
    let items = req.body.products; // should be an array on objects with name, quantity, price, note and basepricemoney obj


    sgMail.setApiKey(process.env.EMAIL_KEY);

    const itemsForEmail = req.session.cart; 
 let cartString = " ";

for (let i = 0; i < itemsForEmail.length; i++) {
cartString = cartString.concat(`${itemsForEmail[i].product.productName} Option: ${itemsForEmail[i].option}, `);
}

console.log(cartString);

let customerInfo = req.body.customer;
let customerString = '';
for (const key in customerInfo) {
if (customerInfo.hasOwnProperty(key)) {
customerString = customerString.concat(`${key}: ${customerInfo[key]}\n`);
}
};

//message to send to customer
const msg = {
  to: `${userEmail}`, 
  from: `chinatimedirect@mail.com`, // Change to your verified sender
  subject: `Your Order Is Being Processed!`,
  html: ` <h1>Your Have Started A New Order With China Time Direct! </h1>
  <h2> Order for ${cartString} is currently being processed until bitcoin payment is verified:</h2>
  <h4> Customer Info: ${customerString}</h4>
  <h6>If you have any questions or concerns please email us!</h6>
  `
};

sgMail.send(msg).then(() => {console.log('Email sent')})
  .catch((error) => {
    console.error(error)
  });


console.log(customerString);

//mesage to send to admin for processing
const msgForAdmin = {
  to: `chinatimedirect@mail.com`, 
  from: `chinatimedirect@mail.com`, // Change to your verified sender
  subject: `Bitcoin Payment Started!`,
  html: ` <h1>New Bitcoin Payment Started From Customer. </h1>
 <h2> Order for ${cartString} is currently being processed!</h2>
 <h4> Delivery Info: ${customerString}</h4>
 `
};

  sgMail.send(msgForAdmin).then(() => {console.log('Email sent')})
  .catch((error) => {
    console.error(error)
  });


if(req.session.cart){ 
  req.session.cart = []; //reset cart back to empty array after purchase
  req.session.save(function(err){
    if (err) return next(err)
}) 
}
res.json({message: 'Successful'})

}catch(err){
  console.log(err);
}

});






//credit card payments

router.post('/payment', async (req, res) => {
  try {
    const payload = req.body;
    console.log(payload);

    console.log(payload.customerOrder.total);

    const numToString = Number(payload.customerOrder.total) + '00';


      const payment = {
        idempotencyKey: payload.idempotencyKey,
        locationId: payload.locationId,
        sourceId: payload.sourceId,
        amountMoney: {
          amount: `${String(numToString)}`, //add two extra zeros for square to ensure it gets processed correctly
          currency: 'USD',
        },
      };

      if (payload.customerId) {
        payment.customerId = payload.customerId;
      }

      if (payload.verificationToken) {
        payment.verificationToken = payload.verificationToken;
      }

      const { result, statusCode } = await client.paymentsApi.createPayment(payment);
      console.log({result, statusCode});

      
      
      if(statusCode == '200'){
        sgMail.setApiKey(process.env.EMAIL_KEY);
        
        const itemsForEmail = req.session.cart; //get cart
        let cartString = " ";
        // add all information from cart to a string
        for (let i = 0; i < itemsForEmail.length; i++) {
          cartString = cartString.concat(`${itemsForEmail[i].product.productName} Option: ${itemsForEmail[i].option}, `);
        }
        console.log(cartString);
        let customerInfo = payload.customerOrder.customer;
        let customerString = '';
        for (const key in customerInfo) {
          if (customerInfo.hasOwnProperty(key)) {
            customerString = customerString.concat(`${key}: ${customerInfo[key]}\n \n`);
          }
        }
        
        //send confirmation email to customer
      const msg = {
        to: `${payload.customerOrder.email}`, 
        from: `chinatimedirect@mail.com`, // Change to your verified sender
        subject: `Your Order Is Being Processed!`,
        html: ` 
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Your Order With China Time Direct Is Being Processed!</h1>
        <h2 style="color: #555;">Order for ${cartString} is currently being processed:</h2>
        <h4 style="color: #777;">Customer Info: ${customerString}</h4>
        <p style="color: #999;">If you have any questions or concerns, please email us!</p>
      </div>
        `
      };
      
      sgMail.send(msg).then(() => {console.log('Email sent')})
      .catch((error) => {
        console.error(error)
      });
      
      
      //send order information to admin for processing
      const msgForAdmin = {
        to: `chinatimedirect@mail.com`, 
        from: `chinatimedirect@mail.com`, // Change to your verified sender
        subject: `NEW Successful Order!`,
        html: ` <h1>New order from customer! </h1>
       <h2> Order for ${cartString} is currently being processed!</h2>
       <h4> Delivery Info: ${customerString}</h4>
       `
      };
      
      
      sgMail.send(msgForAdmin).then(() => {console.log('Email sent')})
      .catch((error) => {
        console.error(error)
      });
      
      
      if(req.session.cart){ 
        req.session.cart = []; //reset cart back to empty array after purchase
        req.session.save(function(err){
          if (err) return next(err)
        }) 
    }
  }
  res.status(statusCode).json({
    success: true,
    payment: {
      id: result.payment.id,
      status: result.payment.status,
      receiptUrl: result.payment.receiptUrl,
      orderId: result.payment.orderId,
    },
  });
  
  
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error);
      res.status(400).json({ error: 'API Error' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
      console.log(error)
    }
  }
});



  module.exports = router