module.exports = function handleError(e) {
  this.status = e.status || 500;
  console.error(e);

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
    case 'InvalidCustomer':
      // I propose we output JSON error messages
      this.body = {
        "error": {
          "type": "invalid_request_error",
          "message": "No such customer: " + this.params.customer,
          "param": "customer"
        }
      };
      break;
    case 'InvalidCharge':
      // I propose we output JSON error messages
      this.body = {
        "error": {
          "type": "invalid_request_error",
          "message": "No such charge: " + this.params.charge,
          "param": "charge"
        }
      };
      break;

    default:
      this.body = e.message;
      break;
  }
};
