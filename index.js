const regl = require('regl')({
  pixelRatio: 1
})
const webVR = require('regl-vr')({ regl })
const renderScene = require('./scene')({ regl })

// WebVR api to get HMD
navigator.getVRDisplays().then((vrDisplays) => {

  if (vrDisplays.length === 0) throw new Error('No VrDisplays.')

  const vrDisplay = vrDisplays[0]
  global.vrDisplay = vrDisplay
  console.log(`VR display detected: ${vrDisplay.displayName}`)
  
  // setup presenting
  vrDisplay.requestPresent([{ source: regl._gl.canvas }])
  startRender({ vrDisplay })

}).catch((err) => {
  console.error(err)
})

// start standard regl render loop
function startRender({ vrDisplay }) {

  // start render loop
  regl.frame(({ tick }) => {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1
    })
    // regl-vr calls the inner block twice
    // to draw each eye of the HMD
    // "projection" and "view" will be set for you
    webVR({ vrDisplay }, renderScene)
  })

}
