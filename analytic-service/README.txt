RUN
====
node --watch index.js

RUN
---
REQ: POST: http://localhost:8000/payment-service
{
    "cart" : [
        {
          "name": "Microsoft",
          "price" : 8000
        },
        {
          "name": "Google",
          "price" : 9000 
        }
    ]
        
}

RESP: 200 (OK)
Payment successful
-Send Msg To Topic "Payment Successful" That will be consumed by "Analytic Service"
http://localhost:8080/ui/clusters/local/all-topics/payment-successful/messages?keySerde=String&valueSerde=String&limit=100
Value:
{
	"userId": "123",
	"cart": [
		{
			"name": "Microsoft",
			"price": 8000
		},
		{
			"name": "Google",
			"price": 9000
		}
	]
}

LOGS:
=====
Analytic consumer: User 123 paid 12000.00
Analytic consumer: User 123 paid 17000.00
