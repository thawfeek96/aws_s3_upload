const { v4: uuidv4 } = require("uuid")
const AWS = require('aws-sdk')


const awsS3FormDataUpload = async (aws_access_key, aws_secret_key, bucket, images) => {
    try {
        const imageURLs = [];

        if (!Array.isArray(images)) {
            images = [images];
        }

        const s3 = new AWS.S3({
            accessKeyId: aws_access_key,
            secretAccessKey: aws_secret_key,
        });

        await Promise.all(images.map(async (image) => {
            const parts = image.mimetype.split('/');
            const fileType = parts[1];
            console.log(image.mimetype);

            const params = {
                Bucket: bucket,
                Key: `${uuidv4()}.${fileType}`,
                Body: image.data,
                ContentType: image.mimetype,
            };

            const result = await s3.upload(params).promise();
            imageURLs.push(result);
        }));

        return {
            success: true,
            message: 'Successfully uploded',
            data: imageURLs
        };
    } catch (error) {
        console.error(error);
        throw new Error("Something went wrong!");
    }
};

const awsS3Base64Upload = async (aws_access_key, aws_secret_key, bucket, base64String, contentType, contentFormat) => {
    if (!base64String) return;

    if (!Array.isArray(base64String)) {
        base64String = [base64String];
    }

    try {
        const s3 = new AWS.S3({
            accessKeyId: aws_access_key,
            secretAccessKey: aws_secret_key,
        });

        const imageURLs = [];

        const getContentType = (contentFormat) => {
            if (contentType === 'image') {
                return `image/${contentFormat}`;
            } else if (contentType === 'document') {
                if (contentFormat === 'pdf') {
                    return 'application/pdf';
                } else if (contentFormat === 'excelSheet') {
                    return 'application/vnd.ms-excel';
                } else if (contentFormat === 'word') {
                    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                } else if (contentFormat === 'csv') {
                    return 'text/csv';
                } else if (contentFormat === 'txt') {
                    return 'text/plain';
                } else {
                    return null;
                }
            } else if (contentType === 'video') {
                if (contentFormat === 'mp4') {
                    return 'video/mp4'
                } else {
                    return null;
                }
            }
            return null;
        };

        for (const item of base64String) {
            const buffer = Buffer.from(
                item.replace(/^data:[a-zA-Z0-9\/]+;base64,/, ''),
                'base64'
            );

            const contentTypeHeader = getContentType(contentFormat);

            if (!contentTypeHeader) {
                return {
                    success: false,
                    message: 'Invalid content format or type required only this format of document(pdf, excelSheet, word, csv, txt) and video(mp4)'
                };
            }

            const params = {
                Bucket: bucket,
                Key: `${uuidv4()}.${contentFormat}`,
                Body: buffer,
                ContentEncoding: 'base64',
                ContentType: contentTypeHeader
            };

            const result = await s3.upload(params).promise();
            imageURLs.push(result);
        }

        return {
            success: true,
            message: 'Successfully uploded',
            data: imageURLs
        };
    } catch (error) {
        console.error(error);
        throw new Error('Something went wrong!');
    }
};


const awsS3DeleteUplodedFile = async (aws_access_key, aws_secret_key, bucket, link) => {
    if (!link) return;
    if (link.length === 0) {
        return;
    }
    try {
        const s3 = new AWS.S3({
            accessKeyId: aws_access_key,
            secretAccessKey: aws_secret_key,
        });
        const parts = link.split("/");
        const filename = parts[parts.length - 1];
        const id = filename.split(".")[0];

        const params = {
            Bucket: bucket,
            Key: id,
        };
        await s3.deleteObject(params).promise((res) => console.log(res));
        return {
            success: true,
            message: 'Successfully deleted'
        };
    } catch (error) {
        console.error(error);
        throw new Error("Somthing went wrong!");
    }
};

module.exports = { awsS3FormDataUpload, awsS3Base64Upload, awsS3DeleteUplodedFile }