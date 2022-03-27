const firePixelsArray = []
let fireWidth = 100
let fireHeight = 100
const fireColorsPalette = [{ "r": 7, "g": 7, "b": 7 }, { "r": 31, "g": 7, "b": 7 }, { "r": 47, "g": 15, "b": 7 }, { "r": 71, "g": 15, "b": 7 }, { "r": 87, "g": 23, "b": 7 }, { "r": 103, "g": 31, "b": 7 }, { "r": 119, "g": 31, "b": 7 }, { "r": 143, "g": 39, "b": 7 }, { "r": 159, "g": 47, "b": 7 }, { "r": 175, "g": 63, "b": 7 }, { "r": 191, "g": 71, "b": 7 }, { "r": 199, "g": 71, "b": 7 }, { "r": 223, "g": 79, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 103, "b": 15 }, { "r": 207, "g": 111, "b": 15 }, { "r": 207, "g": 119, "b": 15 }, { "r": 207, "g": 127, "b": 15 }, { "r": 207, "g": 135, "b": 23 }, { "r": 199, "g": 135, "b": 23 }, { "r": 199, "g": 143, "b": 23 }, { "r": 199, "g": 151, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 175, "b": 47 }, { "r": 183, "g": 175, "b": 47 }, { "r": 183, "g": 183, "b": 47 }, { "r": 183, "g": 183, "b": 55 }, { "r": 207, "g": 207, "b": 111 }, { "r": 223, "g": 223, "b": 159 }, { "r": 239, "g": 239, "b": 199 }, { "r": 255, "g": 255, "b": 255 }]
const canvas = document.createElement('canvas')
const canvasCtx = canvas.getContext('2d')
const pixelSize = 4
const randomWalker = createRandomWalker()
let gravity = 0
let fireEffect = true

function createRandomWalker() {
  let vector = {
    x: Math.round(fireWidth / 2),
    y: Math.round(fireHeight / 2),
    linearPosition: 0
  }
// Function to generate random number 
function randomNumber(min, max) { 
    return Math.random() * (max - min) + min;
} 
  function walk() {
    vector.x = vector.x ;
    vector.y = vector.y ;

    vector.x = between(vector.x, 0, fireWidth - 1)
    vector.y = between(vector.y, 0, fireHeight - 1)
    vector.linearArrayPosition = getLinearArrayPosition()
  }

  function getLinearArrayPosition() {
    vector.linearPosition = vector.x + ( fireWidth * vector.y )
  }

  function between(value, min, max) {
    return (Math.min(max, Math.max(min, value)));
  }

  return {
    vector,
    walk
  }
}

function increaseGravity() {
  gravity = gravity + 0.5
}

function decreaseGravity() {
  gravity = gravity - 0.5
}

function start() {
  createFireDataStructure()

  canvas.width = fireWidth * pixelSize
  canvas.height = fireHeight * pixelSize
  document.querySelector('#fireCanvas').appendChild(canvas)

  setInterval(calculateFirePropagation, 40)
  setInterval(walkRandomWalker, 30)
}

function toggleFireEffect() {
  fireEffect = !fireEffect
}

function walkRandomWalker() {
  if (!fireEffect) {
    // if no fire effect, set all canvas to default state: zero fire intensity
    createFireDataStructure()
  }

  randomWalker.walk()

  // Sorry for this mess, but it's to make a square
  firePixelsArray[randomWalker.vector.linearPosition] = 10
  firePixelsArray[randomWalker.vector.linearPosition - 1] = 10
  firePixelsArray[randomWalker.vector.linearPosition + 3] = 10
  firePixelsArray[randomWalker.vector.linearPosition + 5] = 10
  firePixelsArray[randomWalker.vector.linearPosition + 7] = 10


  firePixelsArray[randomWalker.vector.linearPosition - fireWidth] = 17
  firePixelsArray[randomWalker.vector.linearPosition - fireWidth - 1] = 10
  firePixelsArray[randomWalker.vector.linearPosition - fireWidth + 5] = 10

  firePixelsArray[randomWalker.vector.linearPosition + fireWidth] = 17
  firePixelsArray[randomWalker.vector.linearPosition + fireWidth - 5] = 10
  firePixelsArray[randomWalker.vector.linearPosition + fireWidth + 8] = 10

}

function createFireDataStructure() {
  const numberOfPixels = fireWidth * fireHeight

  for (let i = 0; i < numberOfPixels; i++) {
    firePixelsArray[i] = 0
  }
}

function calculateFirePropagation() {
  for (let column = 0; column < fireWidth; column++) {
    for (let row = 0; row < fireHeight; row++) {
      const pixelIndex = column + (fireWidth * row) 

      updateFireIntensityPerPixel(pixelIndex)
    }
  }

  renderFire()
}

function updateFireIntensityPerPixel(currentPixelIndex) {
  const belowPixelIndex = currentPixelIndex + fireWidth

  // below pixel index overflows canvas
  if (belowPixelIndex >= fireWidth * fireHeight) {
    return
  }

  const decay = Math.floor(Math.random() * 1.4)
  const belowPixelFireIntensity = firePixelsArray[belowPixelIndex]
  const newFireIntensity =
    belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0

  firePixelsArray[currentPixelIndex - decay] = newFireIntensity
}

function renderFire() {
  for (let row = 0; row < fireHeight; row++) {
    for (let column = 0; column < fireWidth; column++) {
      const pixelIndex = column + (fireWidth * row)
      const fireIntensity = firePixelsArray[pixelIndex]
      const color = fireColorsPalette[fireIntensity]
      const colorString = `${color.r},${color.g},${color.b}`

      canvasCtx.fillStyle = ` rgb(${colorString})`
      canvasCtx.fillRect(column * pixelSize, row * pixelSize, pixelSize, pixelSize)
    }
  }
}

function createFireSource() {
  for (let column = 0; column <= fireWidth; column++) {
    const overflowPixelIndex = fireWidth * fireHeight
    const pixelIndex = (overflowPixelIndex - fireWidth) + column

    firePixelsArray[pixelIndex] = 46
  }
}

function destroyFireSource() {
  for (let column = 0; column <= fireWidth; column++) {
    const overflowPixelIndex = fireWidth * fireHeight
    const pixelIndex = (overflowPixelIndex - fireWidth) + column

    firePixelsArray[pixelIndex] = 0
  }
}

function increaseFireSource() {
  for (let column = 0; column <= fireWidth; column++) {
    const overflowPixelIndex = fireWidth * fireHeight
    const pixelIndex = (overflowPixelIndex - fireWidth) + column
    const currentFireIntensity = firePixelsArray[pixelIndex]

    if (currentFireIntensity < 14) {
      const increase = Math.floor(Math.random() * 14)
      const newFireIntensity =
        currentFireIntensity + increase >= 14 ? 14 : currentFireIntensity + increase

      firePixelsArray[pixelIndex] = newFireIntensity
    }
  }
}

function decreaseFireSource() {
  for (let column = 0; column <= fireWidth; column++) {
    const overflowPixelIndex = fireWidth * fireHeight
    const pixelIndex = (overflowPixelIndex - fireWidth) + column
    const currentFireIntensity = firePixelsArray[pixelIndex]

    if (currentFireIntensity > 0) {
      const decay = Math.floor(Math.random() * 14)
      const newFireIntensity =
        currentFireIntensity - decay >= 0 ? currentFireIntensity - decay : 0

      firePixelsArray[pixelIndex] = newFireIntensity
    }
  }
}

start()