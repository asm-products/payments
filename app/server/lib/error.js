module.exports = function handleError(e) {
  this.status = e.status || 500;

  switch (e.type) {
    case 'StripeInvalidRequestError':
      this.body = 'Invalid parameters sent to Stripe. Please check your request body.';
      break;
    case 'StripeAPIError':
      this.body = 'The Stripe API experienced an internal error. Please try again in a few minutes.';
      break;
    case 'StripeConnectionError':
      this.body = 'We encountered a connection error. Please try again in a few minutes.';
      break;
    case 'StripeAuthenticationError':
      this.body = 'There was an issue authenticating with Stripe.';
      break;
    default:
      this.body = e.message;
      break;
  }
};
