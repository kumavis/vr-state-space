const mat4 = require('gl-mat4')
const BlockTracker = require('eth-block-tracker')
const HttpProvider = require('ethjs-provider-http')

const regl = require('regl')({
  pixelRatio: 1
})

const setupView = createCamera({ regl })
const drawText = require('./text')({ regl })
const drawNormyBun = require('./node_modules/regl-vr/example/bunny')({ regl })

const bun = createBun()

const textMat = mat4.identity(mat4.create())

const provider = new HttpProvider('https://mainnet.infura.io')
const tracker = new BlockTracker({ provider, pollingInterval: 2e3 })
tracker.start()

let blocks = []
global.blocks = blocks

tracker.on('latest', (block) => {
  const blockNumber = parseInt(block.number, 16)
  console.log('new head:', blockNumber)
  blocks.push({
    label: `Block #${blockNumber}`,
    matrix: null,
  })
  // reposition all blocks
  blocks.forEach((block, index) => {
    const mat = mat4.identity(mat4.create())
    mat4.translate(mat, mat, [index*10, 0, 0])
    block.matrix = mat
  })
})

regl.frame((props) => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })
  setupView(() => {
    blocks.forEach((block, index) => {
      drawBlock(block, index, props)
    })
  })
})

function drawBlock(block, index, props) {
  drawNormyBun({ model: block.matrix })
  drawText({
    model: block.matrix,
    text: block.label,
  })
}

function createBun(){
  return {
    offset: Math.random(),
    matrix: mat4.identity(mat4.create()),
  }
}

function createCamera({ regl }) {
  return regl({
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
}