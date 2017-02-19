const mat4 = require('gl-mat4')

const regl = require('regl')({
  pixelRatio: 1
})

const drawText = require('./text')({ regl })
const drawNormyBun = require('./node_modules/regl-vr/example/bunny')({ regl })

const bun = createBun()

const setupView = regl({
  uniforms: {
    view: ({tick}) => {
      const t = 0.01 * tick
      return mat4.lookAt([],
        [30 * Math.sin(t), 2.5, 30 * Math.cos(t)],
        [0, 2.5, 0],
        [0, 1, 0])
    },
    projection: ({viewportWidth, viewportHeight}) =>
      mat4.perspective([],
        Math.PI / 4,
        viewportWidth / viewportHeight,
        0.01,
        1000)
  }
})

const textMat = mat4.identity(mat4.create())
// mat4.translate(textMat, textMat, [1,6,0])
// console.log(textMat.join())
// mat4.scale(textMat, textMat, [1,-1,1])
// console.log(textMat.join())

let blockNumber = 3141592
let textString = generateText()

setInterval(() => {
  blockNumber++
  textString = generateText()
}, 1e3)

function generateText(){
  return `Block #${blockNumber}`
}

regl.frame(({ tick, viewportWidth, viewportHeight }) => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })
  setupView(() => {
    drawNormyBun({ model: bun.matrix })
    drawText({
      model: textMat,
      text: textString,
    })
  })
})

function createBun(){
  return {
    offset: Math.random(),
    matrix: mat4.identity(mat4.create()),
  }
}
