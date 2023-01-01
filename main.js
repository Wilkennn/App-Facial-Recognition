const camera = document.querySelector("video")

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startUserVideo)

async function startUserVideo() {
    const constraints = { video: true };

    try {
        let stream = await navigator.mediaDevices.getUserMedia(constraints);

        camera.srcObject = stream;
        camera.onloadedmetadata = e => {
            camera.play();
        }

    } catch (err) {
        console.error(err);
    }
}

camera.addEventListener('play', () => {

    const canvas = faceapi.createCanvasFromMedia(camera) 
    document.body.append(canvas)

    const displaySize = { width: camera.width, height: camera.height }

    faceapi.matchDimensions(canvas, displaySize) 

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
            camera, 
            new faceapi.TinyFaceDetectorOptions() 
        )
            .withFaceLandmarks() 
            .withFaceExpressions() 


        const resizedDetections = faceapi.resizeResults(detections, displaySize) 


        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height) 

        faceapi.draw.drawDetections(canvas, resizedDetections) 
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections) 
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections) 
    }, 100);
})