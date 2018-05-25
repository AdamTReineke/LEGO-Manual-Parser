// This takes the images from step 1 and moves all the pieces to the upper left.
var fs = require('fs');
var PNG = require('pngjs').PNG;

var hasColorFn = function (r, g, b) {
    return (r == 183 && g == 215 && b == 243) || (r == 167 && g == 209 && b == 239);
}

fs.readdir('./imgs', (err, files) => {
    files.forEach((file) => {

        fs.createReadStream('./imgs/' + file)
            .pipe(new PNG({
                filterType: 4
            }))
            .on('parsed', function () {

                let drawRow = 0;
                for (var y = 0; y < this.height; y++) {

                    // Does this row have our color?
                    let hasColor = false;
                    for (var x = 0; x < this.width && hasColor === false; x++) {
                        let idx = (this.width * y + x) << 2;

                        hasColor = hasColorFn(this.data[idx + 0], this.data[idx + 1], this.data[idx + 2]);
                    }

                    if (hasColor) {
                        for (var x = 0; x < this.width; x++) {
                            var readIdx = (this.width * y + x) << 2;
                            var drawIdx = (this.width * drawRow + x) << 2;

                            this.data[drawIdx + 0] = this.data[readIdx + 0];
                            this.data[drawIdx + 1] = this.data[readIdx + 1];
                            this.data[drawIdx + 2] = this.data[readIdx + 2];
                            this.data[drawIdx + 3] = this.data[readIdx + 3];

                            this.data[readIdx + 0] = 255;
                            this.data[readIdx + 1] = 255;
                            this.data[readIdx + 2] = 255;
                            this.data[readIdx + 3] = 255;
                        }
                        drawRow++;
                    }
                }

                // this.data = this.data.slice(0, 4 * this.width * drawRow);
                // this.height = drawRow;
                this.pack().pipe(fs.createWriteStream('./parts/' + file));
            });
    });
});