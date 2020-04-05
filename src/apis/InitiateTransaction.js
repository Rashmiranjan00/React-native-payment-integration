
const https = require('https');
/**
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
const checksum_lib = require('./checksum');

/* initialize an object */
var paytmParams = {};

/* body parameters */
paytmParams.body = {

    /* for custom checkout value is 'Payment' and for intelligent router is 'UNI_PAY' */
    "requestType" : "Payment",

    /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
    "mid" : "YOUR_MID_HERE",

    /* Find your Website Name in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
    "websiteName" : "YOUR_WEBSITE_NAME",

    /* Enter your unique order id */
    "orderId" : "YOUR_ORDER_ID",

    /* on completion of transaction, we will send you the response on this URL */
    "callbackUrl" : "YOUR_CALLBACK_URL",

    /* Order Transaction Amount here */
    "txnAmount" : {

        /* Transaction Amount Value */
        "value" : "TRANSACTION_AMOUNT_VALUE",

        /* Transaction Amount Currency */
        "currency" : "TRANSACTION_AMOUNT_CURRENCY",
    },

    /* Customer Infomation here */
    "userInfo" : {

        /* unique id that belongs to your customer */
        "custId" : "CUSTOMER_ID",
    },
};

/**
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
checksum_lib.genchecksumbystring(JSON.stringify(paytmParams.body), "YOUR_KEY_HERE", function(err, checksum){

    /* head parameters */
    paytmParams.head = {
        
        /* put generated checksum value here */
        "signature"	: checksum
    };

    /* prepare JSON string for request */
    var post_data = JSON.stringify(paytmParams);

    var options = {

        /* for Staging */
        hostname: 'securegw-stage.paytm.in',

        /* for Production */
        // hostname: 'securegw.paytm.in',

        port: 443,
        path: '/theia/api/v1/initiateTransaction?mid=YOUR_MID_HERE&orderId=YOUR_ORDER_ID',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    // Set up the request
    var response = "";
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
            response += chunk;
        });

        post_res.on('end', function(){
            console.log('Response: ', response);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
});

        