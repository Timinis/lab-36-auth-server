'use strict';

import superagent from 'superagent';

import User from '../model';
import { runInNewContext } from 'vm';

// This is currently setup for Google, but we could easily swap it out
// for any other provider or even use a totally different module to
// to do this work.
//
// So long as the method is called "authorize" and we get the request,
// we should be able to roll on our own here...

// Return a user token in the final .then() 

const authorize = (req) => {

  console.log('\n\n1 - AUTH REQ: ', req.query);

  let code = req.query.code;

  // exchange the code for a token

  return superagent
    .post('https://www.googleapis.com/oauth2/v4/token')
    .type('form')
    .send({
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect: `${process.env.API_URL}/oauth`,
      grant_type: 'authorization_code',
    })
    .then(response => {
      console.log('\n\n2 - BODY: ', response.body.access_token);
      let googleToken = response.body.access_token;
      return googleToken;
    })
    .then(token => {
      return superagent.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect')
        .set('Authorization', `Bearer ${token}`)
        .then(response => {
          let user = response.body;
          console.log(`\n\n3 - USER: `, user);
          return user;
        });
    })
    .then(googleUser => {
      console.log('\n\n4 - USER FROM GOOGLE: ', googleUser);
      return User.createFromOAuth(googleUser);
    })
    .then(user => {
      console.log('\n\n5 - USER FROM MONGO: ', user);
      return user.generateToken();
    })
    .catch(error => runInNewContext(error));
};


export default { authorize };
