payments
========

[![Build Status](https://travis-ci.org/asm-products/payments.svg)](https://travis-ci.org/asm-products/payments)

Assembly payments: open and awesome

### API

#### Products

##### Get a product's payment portal

###### DEFINITION

```
HTTP/1.1 GET /products/{PRODUCT_ID}
```

###### EXAMPLE

```
curl /products/helpful
```

#### Plans

##### Create a plan

This route requires the Assembly authentication token of a core team member of the product in the `Authorization` header.

###### DEFINITION

```
HTTP/1.1 POST /products/{PRODUCT_ID}/plans
```

##### EXAMPLE

```
curl -X POST -H "Authorization: {USER_TOKEN}" /products/helpful/plans \
    -d name=Growing \
    -d amount=5000
```

##### Get a plan

###### DEFINITION

```
HTTP/1.1 GET /products/{PRODUCT_ID}/plans/{PLAN_ID}
```

###### EXAMPLE

```
curl /products/helpful/plans/zxAf2yU893
```

##### Update a plan

This route requires the Assembly authentication token of a core team member of the product in the `Authorization` header.

You can only change the name of an existing plan. If other details need to be changed, you'll need to delete the current plan and recreate it with the updated details.

###### DEFINITION

```
HTTP/1.1 PUT /products/{PRODUCT_ID}/plans/{PLAN_ID}
```

###### EXAMPLE

```
curl -X PUT -H "Authorization: {USER_TOKEN}" /products/helpful/plans/zxAf2yU893 \
    -d name=Grown
```

##### Delete a plan

This route requires the Assembly authentication token of a core team member of the product in the `Authorization` header.

####### DEFINITION

```
HTTP/1.1 DELETE /products/{PRODUCT_ID}/plans/{PLAN_ID}
```

###### EXAMPLE

```
curl -X DELETE -H "Authorization: {USER_TOKEN}" /products/helpful/plans/zxAf2yU893
```


### Getting Started

1. `git clone git@github.com:asm-products/payments.git && cd payments`
2. `npm install`
3. `gulp`
