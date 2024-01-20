const router = require('express').Router();

const Visitor = require('../../models/visitor')
const uniqid = require('uniqid');



function getCurrentTime() { //helper function for currentTime
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    // Convert 24-hour time to 12-hour format
    const hours12 = hours % 12 || 12;
    // Zero-pad minutes if necessary
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours12}:${formattedMinutes} ${ampm}`;
  };


  function getDate(){ // helper function for current date
  const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
const day = String(currentDate.getDate()).padStart(2, '0');
const formattedDate = `${month}-${day}-${year}`;
return formattedDate;
  };

  

router.post('/visitor', async (req, res) => {
    try {
      console.log(req.body);
      const ip = req.body.ip;
      // console.log(req.body.url)
      const pages = req.body.pagesVisited; // get pages visited and the time they visited from client
      const user = await Visitor.findOne({ipAddress: ip}); // find user by ip address
      // user.pagesVisited.push(pages);
      if(user){ //if user already exists then update the amount of time they visited

        if(!user.pagesVisited.get(`${req.body.pagesVisited}`)){ //if user hasnt visited a url then add it to the set and the make times visited 1
          user.pagesVisited.set(`${req.body.pagesVisited}`, `1`);
          user.visits++; // increase visits by 1
          user.lastSeenDate = `${getDate()}`; //update last date they visited 
          user.lastSeenTime = `${getCurrentTime()}`; // update last time they visited
          await user.save(); //save 
          return;      
        }
        let pageNumber = user.pagesVisited.get(`${req.body.pagesVisited}`) //get the page number value by the url
      
          user.pagesVisited.set(`${req.body.pagesVisited}`, `${Number(pageNumber) + 1}`); //increase the page view by one, increase everytime user visits page
          user.visits++; // increase visits by 1
      user.lastSeenDate = `${getDate()}`; //update last seen everytime user visits page
      user.lastSeenTime = `${getCurrentTime()}`;
      await user.save(); //save 
      // res.send({message: 'welome'})
      // return;
      }

      if(!user){ //if user doesnt existed then create a user
        try {
        const newUser = new Visitor({
          user: `${uniqid('visitor-')}`, //each user should have unique name
          pagesVisited: new Map(),
          ipAddress: req.body.ip, // get users ip address from front end
          lastSeenTime: `${getCurrentTime()}`,
          lastSeenDate: `${getDate()}`,
          firstVisitDate: `${getDate()} at ${getCurrentTime()}`, // get date they first visited
          city: req.body.city, // get visitors city from req.body
          region: req.body.region, //get region
          // isVpn: req.body.isVpn, //check if they are using vpn
          userAgent: req.body.userAgent, // get userAgent
          // isProxy: req.body.isProxy, // check if they are using proxy
          postal: req.body.postal, // get postal code
          country: req.body.country, //get visitors country from req.body
          visits: 1 // intiated first page visit to 1
        });
        newUser.pagesVisited.set(`${req.body.pagesVisited}`, `1`); //put they page they visited in a map and set initial value as 1

          await newUser.save(); //save user
          // console.log(newUser);
        

          
        } catch (err) {
          console.error('Error creating user:', err);
          res.status(500).send('Error creating user');
        }
      }

      res.json({message: 'Welcome'})
      
      // console.log(req.body.ip);
      // const blocked = await blockedUser.find({ipAddress: req.body.ip});
      // console.log(!blocked)
      // console.log(blocked === blocked);

      // if(!blocked){
      //   console.log("hi");
      //   res.status(200).json({ blockUrl: url + `/admin-panel`});
      // }
      // if(blocked == false){ //if not blocked
      //   console.log("hi");
      // };

      // if(blocked == true){
      //   console.log("no!")
      // }
      // // if(blocked !== false){
      //   console.log('blocked!')
  
      //   res.json({message: 'hi'});
      // }


    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Error creating user');
    }
  });

  module.exports = router;