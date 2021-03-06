# Time Recording Chatbot - A Simple Integration between SAP Business One / ByDesign and SAP Conversational AI powered by Microsoft Azure Cognitive Services

![avatar](https://raw.githubusercontent.com/CyranoChen/time-recording-chatbot-scp/master/resources/splash.png)

This is an integration of SAP Business One or SAP Business ByDesign and SAP Conversational AI powered by Microsoft Azure Cognitive Services. It's using the Cognitive Services Facial Recognition API for employee face recognition and supports the project time recording with SAP Conversational AI.

## Overview

- It is coded in [NodeJS](https://nodejs.org/en/)
- Ready to be deployed in the  [SAP Cloud Platform](https://cloudplatform.sap.com).  
- It is integrated with [SAP Business One](https://www.sap.com/uk/products/business-one.html) using the [Service Layer](https://www.youtube.com/watch?v=zaF_i7x9-s0&list=PLMdHXbewhZ2QsgYSICRQuoL8lkoEHjNzS&index=22) or [SAP Business ByDesign](https://www.sap.com/products/business-bydesign.html) using the [OData API](https://blogs.sap.com/2015/03/10/odata-for-sap-business-bydesign-analytics/).
- It consumes the [Microsoft Azure Cognitive Services Facial Recognition API](https://azure.microsoft.com/en-in/services/cognitive-services/face/).

## Installation in the Cloud

Clone this repository

```sh
$ git clone https://github.com/CyranoChen/time-recording-chatbot-scp
```

Give a name to your app on the [manifest.yml](manifest.yml)

Then set the global variables configuration in [manifest]
It requires a [Microsoft Azure API Key](https://azure.microsoft.com/en-us/try/cognitive-services/?api=face-api) which you can retrive as **Guest** in a 7-day trial or by registering a free Microsoft Azure Account.

```sh
AZURE_APIKEY: <-- YOUR OWN MS AZURE API KEY-->
AZURE_FACE_APIURL: https://<-- YOUR MS AZURE ENDPOINT-->/v1.0
```
<b>Note:</b> It's required to add /v1.0 at the end of the endpoint, e.g.: https://.../face/v1.0

It also requires to fork the [Time-Recording Bot](https://cai.tools.sap/cyrano/time-recoding/train/intents) into your SAP Conversational AI account and add the request token from it:<br> https<span>://</span>cai.tools.sap/<b>&#60;accountname&#62;</b>/time-recoding/settings/tokens.

```sh
RECASTAI_APIKEY: <-- YOUR OWN REQUEST TOKEN-->
RECASTAI_DIALOG_ENDPOINTS: https://api.cai.tools.sap/build/v1/dialog
RECASTAI_REQUEST_ENDPOINTS: https://api.cai.tools.sap/train/v2/request
```



This project depends either on an instance of SAP Business One, version for SAP HANA environment and requires to set the adminstrator/manager account for accessing the service layer.

```sh
B1_SERVICELAYER_APIURL: https://<B1 hostname>:50000/b1s/v1 
B1_USERNAME: <username> 
B1_PASSWORD: <password>
B1_COMPANYDB: <companydb>
```

Or it requires an instance of SAP Business ByDesign by setting the adminstrator account for accessing the odata api of product data.

The odata api [configuration profile](vmumaterial.xml) should be imported by custom odata services.

```sh
BYD_TENANT_HOSTNAME: https://<ByDesign Tenant>/sap/byd/odata/cust/v1 
BYD_USERNAME: <username> 
BYD_PASSWORD: <password>
```

From the root directory, using the [Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html) push your app to the SAP CP Cloud Foundry

```sh
$ cf push
or
$ cf push --random-route
–random-route will avoid name collisions with others that deploy this same app on SCP. You can also choose your own app name by changing the manifest.yml file.
```

Access the app from the URL route shown in the terminal

## Initial Image Labels and Entities

Before you start using the chatbot, it is necessary to click the button of initializing employees and projects

## Demo app

There is a sample implementation [running here](https://time-recording-chatbot.cfapps.eu10.hana.ondemand.com). Be advised that the B1 System Backend is not running 24/7

## License

This code snippet is released under the terms of the MIT license. See [LICENSE](LICENSE) for more information or see https://opensource.org/licenses/MIT.