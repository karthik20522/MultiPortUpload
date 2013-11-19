MultiPortUpload
===============

Speedier upload using Nodejs and Resumable.js. Read more at http://kufli.blogspot.com/2012/06/speedier-upload-using-nodejs-and.html

There are two NodeJS projects attached. First one "UploadTest" is Front end interface (html) where users can upload files and view the thruput and also the modified resumable.js to upload multiple files and multiple chunks. The second project "UploadTest - Standalone Upload Server" is just a standalone upload server accepting files and saving them to hdd. For monitoring the n/w bandwidth, I am listing to the PC's network interface and exposing the Byte's Recived/Second thru web sockets back to the client. 

Note that this a very crude, quick and dirty implementation; well more like a proof of concept. Please modify as per your needs. 
