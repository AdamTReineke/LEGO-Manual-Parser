// This loops over the PDFs in the pdfs folder and makes single image PNGs from them.

var fs = require("fs");
var PDFImage = require("pdf-image").PDFImage;

fs.readdir('./pdfs', (err, files) => {
  files.forEach((file) => {
    var pdfImage = new PDFImage("./pdfs/" + file, {
      combinedImage: true,
      outputDirectory: "./imgs"
    });

    pdfImage.convertFile().then(function (imagePaths) {
      console.log(imagePaths);
    });
  });
});