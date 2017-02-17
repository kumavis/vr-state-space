const mat4 = require('gl-mat4')
const perspective = require('gl-mat4/perspective')
const translate = require('gl-mat4/translate')

const regl = require('regl')({
  pixelRatio: 1
})

const drawText = require('./text')({ regl })
const drawNormyBun = require('./node_modules/regl-vr/example/bunny')({ regl })

const bun = createBun()

const setupView = regl({
  uniforms: {
    projection: [2.117466449737549,0,0,0,0,2.4142136573791504,0,0,0,0,-1.0020020008087158,-1,0,0,-2.002002000808716,0],
    view: ({ tick }) => mat4.lookAt(mat4.create(),
      [0, 2.5, -(20.0 + 10.0 * Math.cos(0.01 * tick))],
      [0, 2.5, 0],
      [0, 1, 0]
    )
  }
})



// regl.frame(({ tick, viewportWidth, viewportHeight }) => {
//   regl.clear({
//     color: [0, 0, 0, 1],
//     depth: 1
//   })
  setupView(() => {
    drawText()
    drawNormyBun({ model: bun.matrix })
  })
  // drawText()
  // drawNormyBun({
  //   model: bun.matrix,
  //   projection: [2.117466449737549,0,0,0,0,2.4142136573791504,0,0,0,0,-1.0020020008087158,-1,0,0,-2.002002000808716,0],
  //   // projection: ({ viewportWidth, viewportHeight }) => {
  //   //   const mat = new Float32Array(16)
  //   //   perspective(
  //   //     mat,
  //   //     (Math.PI / 4.0),
  //   //     0.5 * viewportWidth / viewportHeight,
  //   //     1,
  //   //     1000.0)
  //   //   translate(mat, mat, [0, 0, 0])
  //   //   console.log(mat)
  //   //   return mat
  //   // }
  // })
// })

function createBun(){
  return {
    offset: Math.random(),
    matrix: createBunMatrix(),
  }
}

function createBunMatrix () {
  const mat = mat4.identity(mat4.create())
  // const range = 40
  // const x = range * (1 - 2 * Math.random())
  // const y = range * (1 - 2 * Math.random())
  // translate(mat, mat, [x, -2.5, y])
  // mat4.rotateY(mat, mat, 2 * Math.PI * Math.random())
  // scale(mat, mat, [0.25, 0.25, 0.25])
  return mat
}
