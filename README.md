payments
========

[![Build Status](https://travis-ci.org/asm-products/payments.svg)](https://travis-ci.org/asm-products/payments)

Assembly payments: open and awesome

## Table of Contents

- [Quick Start](#quick-start-or-what-do-i-do-now)
- [API](#api-or-more-details-please)
    - [Products](#products)
    - [Plans](#plans)
    - [Customers](#customers)

### Quick Start, or What do I do now?


If you're looking to implement Assembly Payments into you're app, you're probably a core team member, right? If not, you're gonna need to be: Assembly Payments requires a core team member's authentication token to validate most requests.

With that out of the way, you're going to need to create a couple of plans. This is mostly like [creating a plan on Stripe](https://stripe.com/docs/api/node#create_plan), except you create your plan through the Payments API. For example:

```
curl -X POST https://payments.assembly.com/products/{PRODUCT_ID}/plans \
  -H "content-type: application/json" \
  -H "Authorization: {CORE_TEAM_MEMBER_TOKEN}" \
  -d '{ "id": "product_plan", "name": "Product Plan",  "amount": 1000, "interval": "month" }'
```

You should provide _at least_ all of the above information in the request body, but you can also pass along any of the fields allowed by Stripe. (All right, you don't _need_ to send `interval` if it's `month` &mdash; we'll give you that default.) Note that each plan's `id` needs to be unique, and that we automatically prefix the `id` with the product's slug &mdash; the complete `id` is returned as `stripe_plan_id` when successfully created, e.g:

```
201 Created
{
  "stripe_plan_id": "slug_product_plan"
}
```

Right now, we only support subscriptions. That might change in the future, but for now the main consequence is that you need to create a [Stripe Customer](https://stripe.com/docs/api/node#customers) for each of your users, e.g.:

```
curl -X POST https://payments.assembly.com/products/{PRODUCT_ID}/customers \
  -H "content-type: application/json" \
  -H "Authorization: {CORE_TEAM_MEMBER_TOKEN}" \
  -d '{ "email": "an_awesome_customer@yourapp.com" }'
```

Again, you can pass any of the fields [supported by Stripe](https://stripe.com/docs/api/node#create_customer), including a `card` token (which would then become the customer's default card &mdash; super handy).

It's worth spelling out explicitly that you can create plans and customers at any time; their creation can be an asynchronous part of your payment flow. But they _need_ to be created before you can accept payments (duh).

Finally, you're ready to create a subscription &mdash; this is how you get money:

```
curl -X POST https://payments.assembly.com/products/{PRODUCT_ID}/customers/{CUSTOMER_ID}/subscriptions \
  -H "content-type: application/json" \
  -H "Authorization: {CORE_TEAM_MEMBER_TOKEN}" \
  -d '{ "plan": "product_plan" }'
```

See that `{CUSTOMER_ID}` in the URL? That's the Stripe customer ID that you get when you create a customer above. It's probably safe/easy for you to store that information when you first create a customer, but you can also fetch it later. The onus is on you to keep track of this information. Also note that subscriptions are sub-resources of customers in Stripe's schema, and we echo this model.

If you created the given customer with a default card, the above will work just fine. If you didn't, just pass a `card` field in the request body with the Stripe credit card token that you created for your customer using [Stripe.js](https://stripe.com/docs/stripe.js) and Assembly's public Stripe key (email chuck@assembly.com if you need it).

That's it. You can update and cancel subscriptions as necessary by following the principles outlined above.




### API, or More details, please



#### Products

##### Get a product's payment portal

###### EXAMPLE

Request:

```
curl /products/helpful
```

Response:

A generic payment portal filled in with your product's description and available plans.

#### Plans

##### Create a plan

This route requires the product's authentication token (available to core team members on the product's idea page) in the `Authorization` header.

###### EXAMPLE

Request:

```
curl -X POST -H "Authorization: {USER_TOKEN}" /products/helpful/plans \
    -H "Content-Type: application/json" \
    -d '{ "name": "Growing" "amount": 5000 }'
```

Response:

```
201 Created
{
  "stripe_plan_id": "slug_product_plan"
}
```

##### Get a plan

###### EXAMPLE

Request:

```
curl /products/{PRODUCT_ID}/plans/{PLAN_ID}
```

Response (identical to the [response given by Stripe](https://stripe.com/docs/api/node#retrieve_plan)):

```
{
  "interval": "month",
  "name": "Product Plan",
  "created": 1404363125,
  "amount": 20000,
  "currency": "usd",
  "id": "slug_product_plan",
  "object": "plan",
  "livemode": false,
  "interval_count": 1,
  "trial_period_days": null,
  "metadata": {
  },
  "statement_description": null
}
```

##### Update a plan

This route requires the product's authentication token (available to core team members on the product's idea page) in the `Authorization` header.

You can only change the name of an existing plan. If other details need to be changed, you'll need to delete the current plan and recreate it with the updated details.

###### EXAMPLE

Request:

```
curl -X PUT -H "Authorization: {USER_TOKEN}" /products/{PRODUCT_ID}/plans/{PLAN_ID} \
    -H "Content-Type: application/json" \
    -d '{ "name": "Grown" }'
```

Resonse (identical to the [response given by Stripe](https://stripe.com/docs/api/node#update_plan)):

```
{
  "interval": "month",
  "name": "New Product Plan",
  "created": 1404363125,
  "amount": 20000,
  "currency": "usd",
  "id": "slug_product_plan",
  "object": "plan",
  "livemode": false,
  "interval_count": 1,
  "trial_period_days": null,
  "metadata": {
  },
  "statement_description": null
}

##### Delete a plan

This route requires the product's authentication token (available to core team members on the product's idea page) in the `Authorization` header.

###### EXAMPLE

Request:

```
curl -X DELETE -H "Authorization: {USER_TOKEN}" /products/{PRODUCT_ID}/plans/{PLAN_ID}
```

Response (identical to the [response given by Stripe](https://stripe.com/docs/api/node#delete_plan)):

```
{
  "deleted": true,
  "id": "slug_product_plan"
}
```




#### Customers

These routes require the product's authentication token (available to core team members on the product's idea page) in the `Authorization` header.

The responses are identical to [those provided by Stripe](https://stripe.com/docs/api/node#customers).

##### Create a customer

###### EXAMPLE

Request:

```
curl -X POST /products/meta/customers \
    -H "Content-Type: application/json" \
    -H "Authorization: {AUTH_TOKEN}" \
    -d '{ "email": "{CUSTOMER_EMAIL}", "card": "{STRIPE_CARD_TOKEN}" }'
```

Create the `{STRIPE_CARD_TOKEN}` client-side using [Stripe.js](https://stripe.com/docs/stripe.js) and Assembly's public key.


Response:

```
{
  "object":"customer",
  "created":1412637507,
  "id":"cus_4uZuRZ4KFE0hOF",
  "livemode":false,
  "description":null,
  "email":"stripe_test@asm.co",
  "delinquent":false,
  "metadata":{

  },
  "discount":null,
  "account_balance":0,
  "currency":"usd",
  "cards":{
    "object":"list",
    "total_count":1,
    "has_more":false,
    "url":"/v1/customers/cus_4uZuRZ4KFE0hOF/cards",
    "data":[
      {
        "id":"card_4uZtPyKhOHpbQW",
        "object":"card",
        "last4":"4242",
        "brand":"Visa",
        "funding":"credit",
        "exp_month":1,
        "exp_year":2016,
        "fingerprint":"eJw4uBwBqCPVceU1",
        "country":"US",
        "name":null,
        "address_line1":null,
        "address_line2":null,
        "address_city":null,
        "address_state":null,
        "address_zip":null,
        "address_country":null,
        "cvc_check":"pass",
        "address_line1_check":null,
        "address_zip_check":null,
        "customer":"cus_4uZuRZ4KFE0hOF",
        "type":"Visa"
      }
    ],
    "count":1
  },
  "default_card":"card_4uZtPyKhOHpbQW",
  "active_card":{
    "id":"card_4uZtPyKhOHpbQW",
    "object":"card",
    "last4":"4242",
    "brand":"Visa",
    "funding":"credit",
    "exp_month":1,
    "exp_year":2016,
    "fingerprint":"eJw4uBwBqCPVceU1",
    "country":"US",
    "name":null,
    "address_line1":null,
    "address_line2":null,
    "address_city":null,
    "address_state":null,
    "address_zip":null,
    "address_country":null,
    "cvc_check":"pass",
    "address_line1_check":null,
    "address_zip_check":null,
    "customer":"cus_4uZuRZ4KFE0hOF",
    "type":"Visa"
  }
}
```

##### List all customers

Note that this returns the Payments API's version of your customers, not Stripe's version. The most important piece of information, the customers' Stripe IDs, is in the `stripe_id` field on each object.

###### EXAMPLE

Request:

```
curl /products/{PRODUCT_ID}/custoemrs
```

Response:

```
[
  {
    "_id":"53ff6de612486a16123e8857",
    "email":"foo@bar.com",
    "product_id":"meta",
    "stripe_id":"cus_4fswXj3zOlnwEr",
    "__v":0,
    "created_at":"2014-08-28T17:59:02.708Z"
  },
  {
    "_id":"543323431f1b4dd2c4b7630f",
    "email":"stripe_test@asm.co",
    "product_id":"meta",
    "stripe_id":"cus_4uZuRZ4KFE0hOF",
    "__v":0,
    "created_at":"2014-10-06T23:18:27.304Z"
  }
]
```

##### Retrieve a customer

###### EXAMPLE

Request:

```
curl /products/{PRODUCT_ID}/customers/{CUSTOMER_ID}
```

Response:

```
{
  "object":"customer",
  "created":1412637507,
  "id":"cus_4uZuRZ4KFE0hOF",
  "livemode":false,
  "description":null,
  "email":"stripe_test@asm.co",
  "delinquent":false,
  "metadata":{

  },
  "discount":null,
  "account_balance":0,
  "currency":"usd",
  "cards":{
    "object":"list",
    "total_count":1,
    "has_more":false,
    "url":"/v1/customers/cus_4uZuRZ4KFE0hOF/cards",
    "data":[
      {
        "id":"card_4uZtPyKhOHpbQW",
        "object":"card",
        "last4":"4242",
        "brand":"Visa",
        "funding":"credit",
        "exp_month":1,
        "exp_year":2016,
        "fingerprint":"eJw4uBwBqCPVceU1",
        "country":"US",
        "name":null,
        "address_line1":null,
        "address_line2":null,
        "address_city":null,
        "address_state":null,
        "address_zip":null,
        "address_country":null,
        "cvc_check":"pass",
        "address_line1_check":null,
        "address_zip_check":null,
        "customer":"cus_4uZuRZ4KFE0hOF",
        "type":"Visa"
      }
    ],
    "count":1
  },
  "default_card":"card_4uZtPyKhOHpbQW",
  "active_card":{
    "id":"card_4uZtPyKhOHpbQW",
    "object":"card",
    "last4":"4242",
    "brand":"Visa",
    "funding":"credit",
    "exp_month":1,
    "exp_year":2016,
    "fingerprint":"eJw4uBwBqCPVceU1",
    "country":"US",
    "name":null,
    "address_line1":null,
    "address_line2":null,
    "address_city":null,
    "address_state":null,
    "address_zip":null,
    "address_country":null,
    "cvc_check":"pass",
    "address_line1_check":null,
    "address_zip_check":null,
    "customer":"cus_4uZuRZ4KFE0hOF",
    "type":"Visa"
  }
}
```

##### Update a customer

###### EXAMPLE:

Request:

```
curl -X PUT /products/{PRODUCT_ID}/customers/{CUSTOMER_ID} \
    -H "Content-Type: application/json" \
    -H "Authorization: {AUTH_TOKEN} \
    -d '{ "quantity": "5" }'
```

Response:

(As with `create`, but with the updated fields changed.)

##### Destroy a customer

###### EXAMPLE:

Request:

```
curl -X DELETE /products/{PRODUCT_ID}/customers/{CUSTOMER_ID}
```

Response:

```
{
  "deleted": true,
  "id": "{CUSTOMER_ID}"
}
```

### Contributing, or How you can make Payments better

First, fork this repository. Then

1. `git clone git@github.com:YOU/payments.git && cd payments`
2. `npm install`
3. `gulp`
