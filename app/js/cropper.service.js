cropperApp.factory('cropperFactory', function () {
    
    return {

        originalImgWidth: 0,
        originalImgHeight: 0,
        leftPointX: 0,
        leftPointY: 0,
        rightPointX: 0,
        rightPointY: 0,
        rightBottomPointX: 0,
        rightBottomPointY: 0,
        leftBottomPointX: 0,
        leftBottomPointY: 0,

        startPoint: 0,
        startPointX: 0,
        startPointY: 0,
        startPoint: 0,
        endPointX: 0,

        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight,

        canvasPreview: '',
        canvasImgPath: '',

        imageName: '',

        init(canvas, canvasPreview, addNewImgBtn, previewBlock, backToChange) {
            var self = this;
            self.previewBlock = previewBlock;
            self.backToChange = backToChange;
            self.canvasPreview = canvasPreview;
            var ctx = canvas.getContext('2d');
            var ctxPr = self.canvasPreview.getContext('2d');

            var sliceWidth;
            var sliceHeight;

            var minWidth = 0;
            var minHeight = 0;
            var percent = 5;
            var imagePercent = 0.55;
            var imagePercentHeight = 0.6;

            var pointRect; // frame points rects size
            var lineWidth; // frame width

            var mouseDown = false;
            var onLoadBool = false;
            var moveToY;
            var moveToX;

            var compress_canvas_width;
            var compress_canvas_height;

            addNewImgBtn.addEventListener("change", downloadNewImg);
            //dwld image form input to canvas
            function downloadNewImg(event) {
                var input = event.target;
                var reader = new FileReader();

                reader.onload = function () {
                    var dataURL = reader.result;
                    var output = document.getElementById('upload__img');
                    output.classList.remove('display__none');
                    output.src = dataURL;
                    self.canvasImgPath = output;

                    output.onload = function () {
                        console.log(output.offsetHeight + ' / ' + output.offsetWidth)
                        frameCutter(output, output.offsetHeight, output.offsetWidth);
                        output.classList.add('display__none');
                    }
                };
                reader.readAsDataURL(input.files[0]);
                self.imageName = input.files[0].name;
                self.endPointY += 15;

            }

            //draw image to canvas & draw crop frame
            function frameCutter(canvasImgPath, height, width) {

                // document.getElementById('preview__btn').removeAttribute('disabled');

                self.originalImgWidth = width;
                self.originalImgHeight = height;

                canvas.width = self.originalImgWidth;
                canvas.height = self.originalImgHeight;

                canvas.style.width = '100%';
                canvas.style.height = 'auto';

                pointRect = self.originalImgWidth / 50;
                lineWidth = self.originalImgWidth / 250;

                self.canvasHeight = canvas.height;
                self.canvasWidth = canvas.width;
                minHeight = canvas.height / percent;
                minWidth = canvas.width / percent;


                self.startPointX = self.canvasWidth * 0.05; // start canvas position X
                self.startPointY = self.canvasWidth * 0.05; // start canvas position Y

                self.endPointX = self.canvasWidth * 0.05; // 
                endPointY = self.canvasWidth * 0.05; //

                var retreat = self.canvasWidth * 0.05;

                self.leftBottomPointX = retreat;
                self.leftBottomPointY = retreat;

                self.leftPointX = retreat;
                self.leftPointY = retreat;

                self.rightPointX = retreat;
                self.rightPointY = retreat;

                self.rightBottomPointX = retreat;
                self.rightBottomPointY = retreat;

                ctx.drawImage(canvasImgPath, 0, 0, self.originalImgWidth, self.originalImgHeight);


                ctx.beginPath();

                // start
                ctx.fillStyle = '#0893d2';
                ctx.moveTo(self.leftPointX, self.leftPointY);

                // top
                ctx.lineTo(canvas.width - self.rightPointX, self.rightPointY);

                //right
                ctx.lineTo(canvas.width - self.rightBottomPointX, canvas.height - self.rightBottomPointY);

                // bottom
                ctx.lineTo(self.leftBottomPointX, canvas.height - self.leftBottomPointY);

                //left
                ctx.lineTo(self.leftPointX, self.leftPointY);

                ctx.setLineDash([7, 5]);
                ctx.fillStyle = '#0893d2';
                ctx.strokeStyle = '#0893d2';
                ctx.lineWidth = lineWidth;
                ctx.stroke();

                ctx.closePath();

                putLine();

                frameOutside();

                ctx.fillStyle = '#0893d2';
                ctx.fillRect(self.leftPointX - pointRect / 2, self.leftPointY - pointRect / 2, pointRect, pointRect);
                ctx.fillRect(self.canvasWidth - self.rightPointX - pointRect / 2, self.rightPointY - pointRect / 2, pointRect, pointRect);
                ctx.fillRect(self.canvasWidth - self.rightBottomPointX - pointRect / 2, self.canvasHeight - self.rightBottomPointY - pointRect / 2, pointRect, pointRect);
                ctx.fillRect(self.leftBottomPointX - pointRect / 2, self.canvasHeight - self.leftBottomPointY - pointRect / 2, pointRect, pointRect);

                compress_canvas_width = document.getElementById('canvas').offsetWidth;
                compress_canvas_height = document.getElementById('canvas').offsetHeight;
            }


            function putLine() {

                canvas.addEventListener('mousemove', function (event) {

                    var eX = (self.originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
                    var eY = (self.originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;

                    if (eY > self.leftPointY - (self.originalImgWidth / 50) && eY < self.leftPointY + (self.originalImgWidth / 50) && eX > self.leftPointX - (self.originalImgWidth / 50) && eX < self.leftPointX + (self.originalImgWidth / 50)) {

                        canvas.style.cursor = 'nw-resize';
                        event.preventDefault();
                        mouseDown = true;
                        if (mouseDown) {
                            canvas.addEventListener('mousedown', moveTopLeftLinePerspective, false);
                        }
                    } else if (eY > self.rightPointY - (self.originalImgWidth / 50) && eY < self.rightPointY + (self.originalImgWidth / 50) && eX > self.canvasWidth - self.rightPointX - (self.originalImgWidth / 50) && eX < self.canvasWidth - self.rightPointX + (self.originalImgWidth / 50)) {

                        canvas.style.cursor = 'sw-resize';
                        event.preventDefault();
                        mouseDown = true;
                        if (mouseDown) {
                            canvas.addEventListener('mousedown', moveTopRightLinePerspective, false);
                        }
                    } else if (eX > self.canvasWidth - self.rightBottomPointX - (self.originalImgWidth / 50) && eX < self.canvasWidth - self.rightBottomPointX + (self.originalImgWidth / 50) && eY < self.canvasHeight - self.rightBottomPointY + (self.originalImgWidth / 50) && eY > self.canvasHeight - self.rightBottomPointY - (self.originalImgWidth / 50)) {

                        canvas.style.cursor = 'se-resize';
                        event.preventDefault();
                        mouseDown = true;
                        if (mouseDown) {
                            canvas.addEventListener('mousedown', moveRightBottomLinePerspective, false);
                        }

                    } else if (eX > self.leftBottomPointX - (self.originalImgWidth / 50) && eX < self.leftBottomPointX + (self.originalImgWidth / 50) && eY > self.canvasHeight - self.leftBottomPointY - (self.originalImgWidth / 50) && eY < self.canvasHeight - self.leftBottomPointY + (self.originalImgWidth / 50)) {
                        canvas.style.cursor = 'ne-resize';

                        event.preventDefault();
                        mouseDown = true;
                        if (mouseDown) {
                            canvas.addEventListener('mousedown', moveLeftBottomLinePerspective, false);
                        }

                    }
                    else {
                        canvas.style.cursor = 'default';
                        mouseDown = false;

                        canvas.removeEventListener('mousedown', moveTopLeftLinePerspective);

                        canvas.removeEventListener('mousedown', moveTopRightLinePerspective);

                        canvas.removeEventListener('mousedown', moveRightBottomLinePerspective);

                        canvas.removeEventListener('mousedown', moveLeftBottomLinePerspective);

                    }
                })
            }


            function moveTopLeftLinePerspective(event) {

                canvas.onmousemove = function (event) {
                    var eX = (self.originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
                    var eY = (self.originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;
                    if (eX > self.canvasWidth - self.endPointX - minWidth) {
                        ctx.closePath()
                    }
                    else {
                        canvas.style.cursor = 'nw-resize';

                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(self.canvasImgPath, 0, 0, self.canvasWidth, self.canvasHeight);

                        ctx.beginPath();
                        ctx.moveTo(eX, eY);

                        ctx.lineTo(self.canvasWidth - self.rightPointX, self.rightPointY);

                        ctx.lineTo(self.canvasWidth - self.rightBottomPointX, self.canvasHeight - self.rightBottomPointY);

                        ctx.lineTo(self.leftBottomPointX, self.canvasHeight - self.leftBottomPointY);

                        ctx.lineTo(eX, eY);

                        ctx.stroke();
                        frameOutside();
                        ctx.fillStyle = '#0893d2';
                        ctx.fillRect(eX - pointRect / 2, eY - pointRect / 2, pointRect, pointRect);
                        ctx.fillRect(self.canvasWidth - self.rightPointX - pointRect / 2, self.rightPointY - pointRect / 2, pointRect, pointRect);
                        ctx.fillRect(self.canvasWidth - self.rightBottomPointX - pointRect / 2, self.canvasHeight - self.rightBottomPointY - pointRect / 2, pointRect, pointRect);
                        ctx.fillRect(self.leftBottomPointX - pointRect / 2, self.canvasHeight - self.leftBottomPointY - pointRect / 2, pointRect, pointRect);

                        self.leftPointX = eX;
                        self.leftPointY = eY;

                    }

                }

                canvas.onmouseup = function () {
                    canvas.style.cursor = 'default';
                    canvas.onmousemove = null;
                    ctx.closePath();
                    mouseDown = false;
                    canvas.removeEventListener('mousedown', moveTopLeftLinePerspective);
                }
            }


            function moveTopRightLinePerspective() {
                canvas.onmousemove = function (event) {
                    var eX = (self.originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
                    var eY = (self.originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;
                    if (eY > self.canvasHeight - endPointY - minHeight) {
                        ctx.closePath()
                    }
                    else {
                        canvas.style.cursor = 'sw-resize';

                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        ctx.drawImage(self.canvasImgPath, 0, 0, self.canvasWidth, self.canvasHeight);

                        ctx.beginPath();
                        // start
                        ctx.moveTo(self.leftPointX, self.leftPointY);
                        // top
                        ctx.lineTo(self.canvasWidth - self.rightPointX, self.rightPointY);
                        //right
                        ctx.lineTo(self.canvasWidth - self.rightBottomPointX, self.canvasHeight - self.rightBottomPointY);
                        // bottom
                        ctx.lineTo(self.leftBottomPointX, self.canvasHeight - self.leftBottomPointY);
                        //left
                        ctx.lineTo(self.leftPointX, self.leftPointY);
                        ctx.stroke();
                        frameOutside();

                        ctx.fillStyle = '#0893d2';
                        ctx.fillRect(self.leftPointX - pointRect / 2, self.leftPointY - pointRect / 2, pointRect, pointRect);
                        ctx.fillRect(self.canvasWidth - self.rightPointX - pointRect / 2, self.rightPointY - pointRect / 2, pointRect, pointRect);
                        ctx.fillRect(self.canvasWidth - self.rightBottomPointX - pointRect / 2, self.canvasHeight - self.rightBottomPointY - pointRect / 2, pointRect, pointRect);
                        ctx.fillRect(self.leftBottomPointX - pointRect / 2, self.canvasHeight - self.leftBottomPointY - pointRect / 2, pointRect, pointRect);

                        self.rightPointY = eY;
                        self.rightPointX = self.canvasWidth - eX;

                    }
                }

                canvas.onmouseup = function () {
                    canvas.style.cursor = 'default';
                    canvas.onmousemove = null;
                    ctx.closePath();
                    mouseDown = false;
                    canvas.removeEventListener('mousedown', moveTopRightLinePerspective);
                }
            }


            function moveRightBottomLinePerspective() {
                canvas.onmousemove = function (event) {
                    var eY = (self.originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;
                    var eX = (self.originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
                    if (eY < self.startPointY + minHeight) {
                        ctx.closePath()
                    }
                    else {
                        canvas.style.cursor = 'se-resize';


                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(self.canvasImgPath, 0, 0, self.canvasWidth, self.canvasHeight);

                        ctx.beginPath();
                        ctx.moveTo(self.leftPointX, self.leftPointY);

                        ctx.lineTo(self.canvasWidth - self.rightPointX, self.rightPointY);

                        ctx.lineTo(self.canvasWidth - self.rightBottomPointX, self.canvasHeight - self.rightBottomPointY);

                        ctx.lineTo(self.leftBottomPointX, self.canvasHeight - self.leftBottomPointY);

                        ctx.lineTo(self.leftPointX, self.leftPointY);

                        ctx.stroke();

                        frameOutside();

                        ctx.fillStyle = '#0893d2';
                        ctx.fillRect(self.leftPointX - pointRect / 2, self.leftPointY - pointRect / 2, pointRect, pointRect);
                        ctx.fillRect(self.canvasWidth - self.rightPointX - pointRect / 2, self.rightPointY - pointRect / 2, pointRect, pointRect);
                        ctx.fillRect(self.canvasWidth - self.rightBottomPointX - pointRect / 2, self.canvasHeight - self.rightBottomPointY - pointRect / 2, pointRect, pointRect);
                        ctx.fillRect(self.leftBottomPointX - pointRect / 2, self.canvasHeight - self.leftBottomPointY - pointRect / 2, pointRect, pointRect);

                        self.rightBottomPointX = self.canvasWidth - eX;
                        self.rightBottomPointY = self.canvasHeight - eY;
                    }

                }

                canvas.onmouseup = function () {
                    canvas.style.cursor = 'default';
                    canvas.onmousemove = null;
                    ctx.closePath();
                    mouseDown = false;
                    canvas.removeEventListener('mousedown', moveRightBottomLinePerspective);
                }
            }

            function moveLeftBottomLinePerspective(event) {

                canvas.onmousemove = function (event) {
                    var eX = (self.originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
                    var eY = (self.originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;
                    if (eX > self.canvasWidth - self.endPointX - minWidth) {
                        ctx.closePath()
                    }
                    else {
                        canvas.style.cursor = 'ne-resize';

                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(self.canvasImgPath, 0, 0, self.canvasWidth, self.canvasHeight);

                        ctx.beginPath();
                        ctx.moveTo(self.leftPointX, self.leftPointY);

                        ctx.lineTo(self.canvasWidth - self.rightPointX, self.rightPointY);

                        ctx.lineTo(self.canvasWidth - self.rightBottomPointX, self.canvasHeight - self.rightBottomPointY);

                        ctx.lineTo(self.leftBottomPointX, self.canvasHeight - self.leftBottomPointY);

                        ctx.lineTo(self.leftPointX, self.leftPointY);

                        ctx.stroke();
                        frameOutside();

                        ctx.fillStyle = '#0893d2';
                        ctx.fillRect(self.leftPointX - pointRect / 2, self.leftPointY - pointRect / 2, pointRect, pointRect);
                        ctx.fillRect(self.canvasWidth - self.rightPointX - pointRect / 2, self.rightPointY - pointRect / 2, pointRect, pointRect);
                        ctx.fillRect(self.canvasWidth - self.rightBottomPointX - pointRect / 2, self.canvasHeight - self.rightBottomPointY - pointRect / 2, pointRect, pointRect);
                        ctx.fillRect(self.leftBottomPointX - pointRect / 2, self.canvasHeight - self.leftBottomPointY - pointRect / 2, pointRect, pointRect);

                        self.leftBottomPointX = eX;
                        self.leftBottomPointY = self.canvasHeight - eY;
                    }
                }

                canvas.onmouseup = function () {
                    canvas.style.cursor = 'default';
                    canvas.onmousemove = null;
                    ctx.closePath();
                    mouseDown = false;
                    canvas.removeEventListener('mousedown', moveLeftBottomLinePerspective);
                }
            }

            function frameOutside() {

                ctx.fillStyle = "#22222285";
                // top
                ctx.beginPath();

                ctx.moveTo(self.startPoint, self.startPoint);
                ctx.lineTo(self.canvasWidth, self.startPoint);
                ctx.lineTo(self.canvasWidth, self.rightPointY);
                ctx.lineTo(self.canvasWidth - self.rightPointX, self.rightPointY);
                ctx.lineTo(self.canvasWidth - self.rightPointX, self.rightPointY);
                ctx.lineTo(self.leftPointX, self.leftPointY);
                ctx.lineTo(self.leftPointX, self.leftPointY)
                ctx.lineTo(self.startPoint, self.leftPointY)
                ctx.lineTo(self.startPoint, self.startPoint)

                ctx.fill()
                // left
                ctx.beginPath();

                ctx.moveTo(self.startPoint, self.leftPointY);
                ctx.lineTo(self.leftPointX, self.leftPointY);
                ctx.lineTo(self.leftBottomPointX, self.canvasHeight - self.leftBottomPointY);
                ctx.lineTo(self.leftBottomPointX, self.canvasHeight);
                ctx.lineTo(self.startPoint, self.canvasHeight);
                ctx.lineTo(self.startPoint, self.leftPointY);

                ctx.fill();

                //bottom
                ctx.beginPath();

                ctx.moveTo(self.leftBottomPointX, self.canvasHeight);
                ctx.lineTo(self.leftBottomPointX, self.canvasHeight - self.leftBottomPointY);
                ctx.lineTo(self.canvasWidth - self.rightBottomPointX, self.canvasHeight - self.rightBottomPointY);
                ctx.lineTo(self.canvasWidth, self.canvasHeight - self.rightBottomPointY);
                ctx.lineTo(self.canvasWidth, self.canvasHeight);
                ctx.lineTo(self.leftBottomPointX, self.canvasHeight);

                ctx.fill();
                //right
                ctx.beginPath();

                ctx.moveTo(self.canvasWidth - self.rightBottomPointX, self.canvasHeight - self.rightBottomPointY);
                ctx.lineTo(self.canvasWidth, self.canvasHeight - self.rightBottomPointY);
                ctx.lineTo(self.canvasWidth, self.rightPointY);
                ctx.lineTo(self.canvasWidth - self.rightPointX, self.rightPointY);
                ctx.lineTo(self.canvasWidth - self.rightBottomPointX, self.canvasHeight - self.rightBottomPointY)

                ctx.fill();
            }

        },

        backToChangeFoo(previewBlock) {
            previewBlock.style.display = 'none';
        },
        cutImage(canvasPreview, canvasImgPath, imageName, previewBlock, downlBtn, mode) {
            var self = this;

            previewBlock.style.display = 'block';

            var coecifX = self.originalImgWidth / (self.canvasWidth);
            var coecifY = self.originalImgHeight / (self.canvasHeight);

            var sliceLeftX = ((self.originalImgWidth * (Math.floor(100 * self.startPointX) / self.canvasWidth)) / 100);
            var sliceLeftY = ((self.originalImgHeight * (Math.floor(100 * self.startPointY) / self.canvasHeight)) / 100);
            sliceHeight = ((self.canvasHeight - self.leftPointX - self.leftBottomPointX) + (self.canvasHeight - self.rightPointX - self.rightBottomPointX)) / 2;
            // borders od canvas. To caulculate right slice width
            var b = Math.pow((self.leftBottomPointY - self.rightPointY), 2);
            var g = Math.pow((self.canvasWidth - self.leftBottomPointX - self.rightBottomPointX), 2);
            var a = Math.sqrt(b + g);
            var d = (self.canvasHeight - self.leftPointY - self.leftBottomPointY);
            var c = (self.canvasHeight - self.rightPointY - self.rightBottomPointY)

            sliceWidth = a * (c / d);

            canvasPreview.width = sliceWidth;
            canvasPreview.height = sliceHeight + 30 + self.originalImgHeight / 25;
            canvasPreview.style.width = '100%';
            canvasPreview.style.height = 'auto';
            var ctxPr = canvasPreview.getContext('2d');
            var hiddenCanvas = document.createElement('canvas');

            var ctxHidCan = hiddenCanvas.getContext('2d');

            hiddenCanvas.width = sliceWidth;
            hiddenCanvas.height = sliceHeight;
            hiddenCanvas.style.width = '100%';
            hiddenCanvas.style.height = 'auto';

            self.mapTriangleHalf(ctxHidCan,
                self.leftPointX, self.leftPointY, self.canvasWidth - self.rightBottomPointX, self.canvasHeight - self.rightBottomPointY, self.leftBottomPointX, self.canvasHeight - self.leftBottomPointY,
                0, 0, sliceWidth, sliceHeight, 0, sliceHeight, canvasImgPath, hiddenCanvas, canvasPreview, ctxPr
            );
            // eliminate slight space between triangles
            ctxHidCan.translate(-1, 1);

            // unwarp the top-right triangle of the warped polygon
            self.mapTriangleFull(ctxHidCan,
                self.leftPointX, self.leftPointY, self.canvasWidth - self.rightPointX, self.rightPointY, self.canvasWidth - self.rightBottomPointX, self.canvasHeight - self.rightBottomPointY,
                0, 0, sliceWidth, 0, sliceWidth, sliceHeight, canvasImgPath, hiddenCanvas, canvasPreview, ctxPr, imageName, downlBtn, mode
            );

        },

        mapTriangleHalf(ctx, p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p_0_x, p_0_y, p_1_x, p_1_y, p_2_x, p_2_y, canvasImgPath, hiddenCanvas, canvasPreview, ctxPr) {
            var self = this;
            // break out the individual triangles x's & y's
            var x0 = p_0_x, y0 = p_0_y;
            var x1 = p_1_x, y1 = p_1_y;
            var x2 = p_2_x, y2 = p_2_y;
            var u0 = p0_x, v0 = p0_y;
            var u1 = p1_x, v1 = p1_y;
            var u2 = p2_x, v2 = p2_y;

            // save the unclipped & untransformed destination canvas
            ctx.save();

            // clip the destination canvas to the unwarped destination triangle
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            ctx.clip();

            // Compute matrix transform
            var delta = u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2;
            var delta_a = x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2;
            var delta_b = u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2;
            var delta_c = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2 - v0 * u1 * x2 - u0 * x1 * v2;
            var delta_d = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
            var delta_e = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
            var delta_f = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2 - v0 * u1 * y2 - u0 * y1 * v2;

            // Draw the transformed image
            ctx.transform(
                delta_a / delta, delta_d / delta,
                delta_b / delta, delta_e / delta,
                delta_c / delta, delta_f / delta
            );
            // bottom slab legs
            ctx.fillStyle = '#ffffff';

            ctx.drawImage(canvasImgPath, 0, 0);

            var onLoadBool = false;

            var prDataUrl = hiddenCanvas.toDataURL("image/jpeg");
            var previewDataImage = new Image();
            previewDataImage.src = prDataUrl;
            // canvas priview with legs drawing 
            previewDataImage.onload = function () {
                ctxPr.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
                ctxPr.fillStyle = '#ffffff';
                ctxPr.fillRect(0, 0, canvasPreview.width, canvasPreview.height);
                ctxPr.drawImage(previewDataImage, self.startPoint + 20, self.startPoint + 20, sliceWidth - 40, sliceHeight - 30);

            }


            ctx.restore();

        },

        mapTriangleFull(ctx, p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p_0_x, p_0_y, p_1_x, p_1_y, p_2_x, p_2_y, canvasImgPath, hiddenCanvas, canvasPreview, ctxPr, imageName, downlBtn, mode) {
            var self = this;
            // break out the individual triangles x's & y's
            var x0 = p_0_x, y0 = p_0_y;
            var x1 = p_1_x, y1 = p_1_y;
            var x2 = p_2_x, y2 = p_2_y;
            var u0 = p0_x, v0 = p0_y;
            var u1 = p1_x, v1 = p1_y;
            var u2 = p2_x, v2 = p2_y;

            // save the unclipped & untransformed destination canvas
            ctx.save();

            // clip the destination canvas to the unwarped destination triangle
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            ctx.clip();

            // Compute matrix transform
            var delta = u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2;
            var delta_a = x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2;
            var delta_b = u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2;
            var delta_c = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2 - v0 * u1 * x2 - u0 * x1 * v2;
            var delta_d = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
            var delta_e = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
            var delta_f = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2 - v0 * u1 * y2 - u0 * y1 * v2;

            // Draw the transformed image
            ctx.transform(
                delta_a / delta, delta_d / delta,
                delta_b / delta, delta_e / delta,
                delta_c / delta, delta_f / delta
            );

            // bottom slab legs
            var imageLeftLeg = new Image();
            var imageRightLeg = new Image();

            imageLeftLeg.src = '../app/img/left_stick.png';
            imageLeftLeg.crossOrigin = "Anonymous";

            imageRightLeg.src = '../app/img/right_stick.png';
            imageRightLeg.crossOrigin = "Anonymous";

            ctx.fillStyle = '#ffffff';

            ctx.drawImage(canvasImgPath, 0, 0);

            var prDataUrl = hiddenCanvas.toDataURL("image/jpeg");
            var previewDataImage = new Image();
            previewDataImage.src = prDataUrl;
            // canvas priview with legs drawing 
            previewDataImage.onload = function () {
                ctxPr.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
                ctxPr.fillStyle = '#ffffff';
                ctxPr.fillRect(0, 0, canvasPreview.width, canvasPreview.height);

                ctxPr.drawImage(previewDataImage, self.startPoint + 20, self.startPoint + 20, sliceWidth - 40, sliceHeight - 30);

                ctxPr.drawImage(imageLeftLeg, sliceWidth * 0.2, sliceHeight - 10, sliceWidth / 20, self.originalImgHeight / 25);

                ctxPr.drawImage(imageRightLeg, sliceWidth - sliceWidth * 0.25, sliceHeight - 10, sliceWidth / 20, self.originalImgHeight / 25);
                var prUrl = canvasPreview.toDataURL("image/jpeg");
                console.log(mode);
                if (mode == 'button') {
                    downlBtn.setAttribute('href', prUrl);
                    downlBtn.download = imageName;
                }
                else {
                    console.log(prUrl);
                }

            }

            ctx.restore();

        }

    };

});