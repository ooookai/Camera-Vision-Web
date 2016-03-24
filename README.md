

#Camera Vision Web
Developer the web to try the *Google Cloud Vision API*

##Process
Use camera of your device to take a picture, and then transfer it to try Google Cloud Vision API. (*iOS is not allowed to get camera auth*)

##Demo
[Demo on Github Page](http://ooookai.github.io/Camera-Vision-Web)


##Fork and Try
 1. Select or create a Google Cloud Platform Console project.
 2. Enable billing for your project.
 3. Enable the Google Cloud Vision API.
 4. Get your project API key, and then Update it of request URL in app.js
```js
// Request URL
vision.googleapis.com/v1/images:annotate?key=< insert browser_api_key_here >;
```
*****

##Reference
- [Cloud Vision API Introduce](https://cloud.google.com/vision/)
- [Getting Started](https://cloud.google.com/vision/docs/getting-started)
- [Pricing](https://cloud.google.com/vision/docs/pricing)

##Google API Prices
- Charges are incurred for each feature applied to an image. For example, if you apply Face Detection and Label Detection to the same image, each feature would be billed individually. In this case, the user is billed for 1 unit of Label Detection and 1 unit for Face Detection. Price is determined by a number of units per month.
- Under 1000 units/month is free for each feature. [More API Pricing information](https://cloud.google.com/vision/docs/pricing) 


##License
Copyright (c) 2015-present, ooookai
All rights reserved.

This source code is licensed under the MIT License (MIT) found in the
LICENSE file in the root directory of this source tree. An additional grant 
of patent rights can be found in the PATENTS file in the same directory.
