const vec2 = require('gl-vec2')
const vectorizeText = require('vectorize-text')

module.exports = function generateTextDrawer({ regl }) {

  // cache text mesh
  let currentText = undefined
  let textMesh = undefined

  generateTextMesh()

  // 'Block #3,141,592'
  function generateTextMesh(props = {}) {
    text = props.text
    if (!text) return textMesh = { positions: [], cells: [] }
    if (currentText === text) return
    currentText = text
    textMesh = vectorizeText(text, {
      textAlign: 'center',
      textBaseline: 'hanging',
      // width: 500,
      triangles: true,
    })
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
      position: () => textMesh.positions,
    },

    elements: () => textMesh.cells,

    uniforms: {
      model: regl.prop('model'),
      color: [0/255, 150/255, 200/255, 1],
    },

    depth: { enable: false }
  })

  return (props) => {
    generateTextMesh({ text: props.text })
    drawText(props)
  }

}