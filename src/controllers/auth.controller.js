import { expressjwt as expressJwt }from 'express-jwt';

function authJwt(){
    //const secret = process.env.ACCESS_TOKEN_SECRET;
    const secret = 'This is my secret key'
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/users(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/orders(.*)/ , methods: ['GET', 'OPTIONS', 'POST'] },
            {url: /\/api\/v1\/users(.*)/ , methods: ['GET', 'OPTIONS', 'POST'] },
        ]
    })
}

async function isRevoked(req, payload) {
    console.log(payload.payload.isAdmin);
    if (!payload.payload.isAdmin) {
      return true; // not admin so cancel request
    }
    return false;
}

export {authJwt};




// async function isRevoked(req, token) {
//     console.log(token,"token")
//     if(!token.payload.isAdmin) {
//         //done(null, true)
//         return true;
//     }

//     //done();
//     return false;
// }

// async function isRevoked(req, payload, done) {
//     if (!payload.isAdmin) {
//         done(null, true);
//     }

//     done();
// }