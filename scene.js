const quat = require('gl-quat')
const mat4 = require('gl-mat4')
const translate = require('gl-mat4/translate')
const scale = require('gl-mat4/scale')

const generateBun = require('./node_modules/regl-vr/example/bunny')
const generateWireBun = require('./node_modules/regl-vr/example/wire')

module.exports = function({ regl }){

  // instantiate bun renderers
  const drawNormyBun = generateBun({ regl })
  const drawWireBun = generateWireBun({ regl })

  const buns = []

  for (let index = 0; index < 100; index++) {
    buns.push(createBun())
  }

  // define render fn
  return ({ tick }) => {

    // move buns
    buns.forEach((bun) => {
      bunJump({ tick, offset: bun.offset, matrix: bun.matrix})
    })

    // draw buns
    buns.forEach((bun) => {
      // drawWireBun({
      //   model: bun.matrix,
      // })
      drawNormyBun({
        model: bun.matrix,
      })
    })

  }

}

function createBun(){
  return {
    offset: Math.random(),
    matrix: createBunMatrix(),
  }
}

function createBunMatrix () {
  const mat = mat4.identity(mat4.create())
  const range = 40
  const x = range * (1 - 2 * Math.random())
  const y = range * (1 - 2 * Math.random())
  translate(mat, mat, [x, -2.5, y])
  mat4.rotateY(mat, mat, 2 * Math.PI * Math.random())
  scale(mat, mat, [0.25, 0.25, 0.25])
  return mat
}

function bunJump({ tick, offset, matrix }) {
  const jump = Math.max(0, 5 * Math.sin(tick/50 + 100 * offset))
  const y = -2.5 + jump
  // y pos
  matrix[13] = y
  return matrix
}