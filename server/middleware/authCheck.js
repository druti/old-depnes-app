import jwt from 'express-jwt'

// Authentication middleware provided by express-jwt.
// This middleware will check incoming requests for a valid
// JWT on any routes that it is applied to.
const authCheck = jwt({
  secret: new Buffer(
    'ZPAFgmIVTR8sDvXSTrT8qjUAsidlctE--ostC5WfRD7ww9PI0A9pZROWx-Sn_BNd',
    'base64'
  ),
  audience: 'wsTRLfN6pOyjQDpfCYzTOzFYNnq0ycbz',
});

export default authCheck;
