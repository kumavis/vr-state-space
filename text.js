const vec2 = require('gl-vec2')
const vectorizeText = require('vectorize-text')
const BlockTracker = require('eth-block-tracker')
const HttpProvider = require('ethjs-provider-http')

module.exports = function generateTextDrawer({ regl }) {

  // cache text mesh
  let textMeshCache = {}
  let currentMesh = null

  // 'Block #3,141,592'
  function getTextMesh(props = {}) {
    text = props.text
    if (!text) return { positions: [], cells: [] }
    const cachedMesh = textMeshCache[text]
    if (cachedMesh) return cachedMesh
    const newMesh = vectorizeText(text, {
      textAlign: 'center',
      textBaseline: 'hanging',
      // width: 500,
      triangles: true,
    })
    textMeshCache[text] = newMesh
    return newMesh
  }

  const drawText = regl({

    vert: `
    attribute vec2 position;
    uniform mat4 projection, view, model;
    void main () {
      // flip text bc mesh is generated upside down
      mat4 flippedModel = model;
      flippedModel[1].y *= -1.;
      gl_Position = projection * view * flippedModel * vec4(position, 0, 1);
    }`,

    frag: `
    precision mediump float;
    uniform vec4 color;
    void main () {
      gl_FragColor = color;
    }`,

    attributes: {
      position: () => currentMesh.positions,
    },

    elements: () => currentMesh.cells,

    uniforms: {
      model: regl.prop('model'),
      color: [0/255, 150/255, 200/255, 1],
    },

    depth: { enable: false }
  })

  return (props) => {
    currentMesh = getTextMesh({ text: props.text })
    drawText(props)
  }

}