# aws_s3_image_upload

This package allows you to easily upload images and files to Amazon S3 storage and obtain the corresponding links for the uploaded content.

## Overview

This package provides functions to simplify the process of uploading images and other files to AWS S3 storage and obtaining the corresponding file links. It supports both image upload from a file and base64-encoded strings.

## Installation

You can install this package using npm:

``npm install awss3image_upload``

Usage

Uploading Images and Files

To upload images to AWS S3, you can use the awsS3FormDataUpload function. Here's an example of how to use it:

````
const imageUpload = require('awss3image_upload');

const data = {
    accesskey: 'your_access_key',
    secretkey: 'your_secret_key',
    bucketname: 'your_bucket_name/your_bucket_folder_name',
    image: your_files
};

const response = imageUpload.awsS3FormDataUpload(data.accesskey, data.secretkey, data.bucketname, data.image);

console.log(response);
````

Uploading Base64-Encoded Files
For AWS S3, you can also upload base64-encoded strings using the awsS3Base64Upload function. Here's an example:

````
const imageUpload = require('awss3image_upload');

const data = {
    accesskey: 'your_access_key',
    secretkey: 'your_secret_key',
    bucketname: 'your_bucket_name/your_bucket_folder_name',
    base64String: ['base64_encoded_string_1', 'base64_encoded_string_2'],
    contentType: 'image', // or 'document', 'video', etc.
    contentFormat: 'png' // or 'jpeg', 'pdf', 'mp4', etc.
};

const response = imageUpload.awsS3Base64Upload(data.accesskey, data.secretkey, data.bucketname, data.base64String, data.contentType, data.contentFormat);

console.log(response);
````

Deleting Uploaded Files
You can also delete uploaded files using the deleteS3File function. Here's an example:

````
const imageUpload = require('awss3image_upload');

const response = imageUpload.deleteS3File('your_access_key', 'your_secret_key', 'your_bucket_name/your_bucket_folder_name', 'https://your_s3_link/file_key');

console.log(response);
````

Response Format
The response from both upload functions will be an object with the following structure:

````
{
    "success": true,
    "message": "Successfully uploaded",
    "data": [
        {
            "ETag": "\"file_etag\"",
            "ServerSideEncryption": "AES256",
            "Location": "https://your_bucket_name.s3.amazonaws.com/your_file_key",
            "key": "your_bucket_folder_name/your_file_key",
            "Key": "your_bucket_folder_name/your_file_key",
            "Bucket": "your_bucket_name"
        }
    ]
}
````
Response Format:
The response from deleted functions will be an object with the following structure:
````
{
    "success": true,
    "message": "Successfully deleted",
    
}
````
Dependencies
This package relies on AWS SDK for JavaScript in Node.js to interact with AWS S3.

Note
Ensure that you have appropriate permissions set up on your AWS account to perform S3 operations.



Please make sure to replace placeholders like `your_access_key`, `your_secret_key`, `your_bucket_name`, `your_bucket_folder_name`, `base64_encoded_image_string`, and others with actual values as needed.

Feel free to customize the README further to include any additional information, examples, or explanations that you think would be helpful for users of your package.
