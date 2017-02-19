const vec2 = require('gl-vec2')

module.exports = function generateTextDrawer({ regl }) {

  const drawText = regl({

    vert: `
    precision highp float;

    uniform mat4 projection, view, model;
    attribute vec2 position;
    varying vec2 uv;

    void main () {
      uv = position;
      gl_Position = projection * view * model * vec4(position, 0.0, 1);
    }
    `,

    frag: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 uv;

    // sizes in real pixels
    uniform vec2 resolution;
    float size = 1.;
    
    // sizes in pseudo pixels
    float screenWidth = 64.;
    float screenHeight = 32.;
    float charWidth = 3.;
    float colSpacing = 1.;
    float colWidth = charWidth + colSpacing;
    float charHeight = 5.;
    float lineSpacing = 1.;
    float lineHeight = charHeight + lineSpacing;
    float paddingLeft = 1.;
    float paddingRight = 1.;
    float paddingTop = 1.;


    #define advanceCursor cursor.x += colWidth;
    #define newLine cursor = vec2(1,cursor.y - lineHeight);
    #define textWrap if(cursor.x > (screenWidth - (paddingLeft + paddingRight))) newLine;

  
    // all characters are 3x5 (15 bit) bitvectors starting at lower right corner
    //
    //           ========================= row total
    //           16384 |   8192 |   4096 = 28672
    //            2048 |   1024 |    512 = 3584
    //             256 |    128 |     64 = 448
    //              32 |     16 |      8 = 56
    //               4 |      2 |      1 = 7
    //           =========================
    // col total 18724 |   9362 |   4681
    //

    // via http://www.dafont.com/pixelzim3x5.font
    #define A pixel += ink * Sprite3x5(     31725., vPos-cursor); advanceCursor textWrap
    #define B pixel += ink * Sprite3x5(     31663., vPos-cursor); advanceCursor textWrap
    #define C pixel += ink * Sprite3x5(     31015., vPos-cursor); advanceCursor textWrap
    #define D pixel += ink * Sprite3x5(     27502., vPos-cursor); advanceCursor textWrap
    #define E pixel += ink * Sprite3x5(     31143., vPos-cursor); advanceCursor textWrap
    #define F pixel += ink * Sprite3x5(     31140., vPos-cursor); advanceCursor textWrap
    #define G pixel += ink * Sprite3x5(     31087., vPos-cursor); advanceCursor textWrap
    #define H pixel += ink * Sprite3x5(     23533., vPos-cursor); advanceCursor textWrap
    #define I pixel += ink * Sprite3x5(     29847., vPos-cursor); advanceCursor textWrap
    #define J pixel += ink * Sprite3x5(      4719., vPos-cursor); advanceCursor textWrap
    #define K pixel += ink * Sprite3x5(     23469., vPos-cursor); advanceCursor textWrap
    #define L pixel += ink * Sprite3x5(     18727., vPos-cursor); advanceCursor textWrap
    #define M pixel += ink * Sprite3x5(     24429., vPos-cursor); advanceCursor textWrap
    #define N pixel += ink * Sprite3x5(      7148., vPos-cursor); advanceCursor textWrap
    #define O pixel += ink * Sprite3x5(     31599., vPos-cursor); advanceCursor textWrap
    #define P pixel += ink * Sprite3x5(     31716., vPos-cursor); advanceCursor textWrap
    #define Q pixel += ink * Sprite3x5(     31609., vPos-cursor); advanceCursor textWrap
    #define R pixel += ink * Sprite3x5(     27565., vPos-cursor); advanceCursor textWrap
    #define S pixel += ink * Sprite3x5(     31183., vPos-cursor); advanceCursor textWrap
    #define T pixel += ink * Sprite3x5(     29842., vPos-cursor); advanceCursor textWrap
    #define U pixel += ink * Sprite3x5(     23407., vPos-cursor); advanceCursor textWrap
    #define V pixel += ink * Sprite3x5(     23402., vPos-cursor); advanceCursor textWrap
    #define W pixel += ink * Sprite3x5(     23421., vPos-cursor); advanceCursor textWrap
    #define X pixel += ink * Sprite3x5(     23213., vPos-cursor); advanceCursor textWrap
    #define Y pixel += ink * Sprite3x5(     23186., vPos-cursor); advanceCursor textWrap
    #define Z pixel += ink * Sprite3x5(     29351., vPos-cursor); advanceCursor textWrap

    #define n0 pixel += ink * Sprite3x5(    31599., vPos-cursor); advanceCursor textWrap
    #define n1 pixel += ink * Sprite3x5(     9362., vPos-cursor); advanceCursor textWrap
    #define n2 pixel += ink * Sprite3x5(    29671., vPos-cursor); advanceCursor textWrap
    #define n3 pixel += ink * Sprite3x5(    29391., vPos-cursor); advanceCursor textWrap
    #define n4 pixel += ink * Sprite3x5(    23497., vPos-cursor); advanceCursor textWrap
    #define n5 pixel += ink * Sprite3x5(    31183., vPos-cursor); advanceCursor textWrap
    #define n6 pixel += ink * Sprite3x5(    31215., vPos-cursor); advanceCursor textWrap
    #define n7 pixel += ink * Sprite3x5(    29257., vPos-cursor); advanceCursor textWrap
    #define n8 pixel += ink * Sprite3x5(    31727., vPos-cursor); advanceCursor textWrap
    #define n9 pixel += ink * Sprite3x5(    31695., vPos-cursor); advanceCursor textWrap

    #define DOT pixel += ink * Sprite3x5(       2., vPos-cursor); advanceCursor textWrap
    #define COLON pixel += ink * Sprite3x5(  1040., vPos-cursor); advanceCursor textWrap
    #define PLUS pixel += ink * Sprite3x5(   1488., vPos-cursor); advanceCursor textWrap
    #define DASH pixel += ink * Sprite3x5(    448., vPos-cursor); advanceCursor textWrap
    #define LPAREN pixel += ink * Sprite3x5(10530., vPos-cursor); advanceCursor textWrap
    #define RPAREN pixel += ink * Sprite3x5( 8778., vPos-cursor); advanceCursor textWrap

    #define _  advanceCursor textWrap

    #define BLOCK pixel += ink * Sprite3x5( 32767., vPos-cursor); advanceCursor textWrap
    #define QMARK pixel += ink * Sprite3x5( 25218., vPos-cursor); advanceCursor textWrap
    #define EXCLAM pixel += ink * Sprite3x5( 9346., vPos-cursor); advanceCursor textWrap

    //returns 0/1 based on the state of the given bit in the given number
    float getBit(float num, float bit){
        num = floor(num);
        bit = floor(bit);
        return float(mod(floor(num/pow(2.,bit)),2.) == 1.0);
    }

    float Sprite3x5(float sprite, vec2 p){
        float bounds = float(all(lessThan(p,vec2(charWidth,charHeight))) && all(greaterThanEqual(p,vec2(0,0))));
        return getBit(sprite, ((charWidth - 1.) - p.x) + charWidth * p.y) * bounds;
    }

    void main( void ) {
      // position on virtual screen (screenWidth,screenHeight)
      vec2 vPos = floor(( vec2(1.-uv.x, uv.y) ) * vec2(screenWidth, screenHeight));
      
      // apply ink?
      vec3 pixel = vec3 (0);
      // cursor position
      vec2 cursor = vec2(paddingLeft,(screenHeight - charHeight - paddingTop));
      // ink color
      vec3 ink = vec3(0,0,1);

      _ N U M B E R _ O N E _ B U N
      _ N O _ B U N _ G R E A T E R
      _ T H A N _ T H I S _ B U N
      _ T H I S _ I S _ P E A K _ B U N
      _ N U M B E R _ O N E _ B U N
      _ N O _ B U N _ G R E A T E R
      _ T H A N _ T H I S _ B U N
      _ T H I S _ I S _ P E A K _ B U N
      _ N U M B E R _ O N E _ B U N
      _ N O _ B U N _ G R E A T E R
      _ T H A N _ T H I S _ B U N
      _ T H I S _ I S _ P E A K _ B U N

      // only write if pen down
      if (pixel.z > 0.1) {
        gl_FragColor = vec4(pixel, 1);
      } else {
        gl_FragColor = vec4(pixel, 0);
      }
    }
    `,

    attributes: {
      // square from two triangle
      position: [ 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0 ],
    },
    count: 6,

    depth: { enable: false },

    blend: {
      enable: true
    },

    uniforms: {
      model: regl.prop('model'),
      resolution: ({ viewportWidth, viewportHeight }) => vec2.fromValues(viewportWidth, viewportHeight),
    }
  })

  return drawText

}