import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    // add custom properties if needed later
  }
}
