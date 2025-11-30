import Blocky from '../../game/Blocky.js';
import BlockyEvent from '../../game/BlockyEvent.js';
import BlockyState from '../../game/BlockyState.js';
import Coord from '../../game/structs/Coord.js';

const shapeColors = [
  // top+left border, fill, bottom+right border

  ['#161616', '#000000', '#161616'], // empty

  // O = yellow
  ['#FFFF00', '#DFDF00', '#AFAF00'],
  // I = cyan
  ['#00FFFF', '#00DFDF', '#00AFAF'],
  // S = green
  ['#00FF00', '#00DF00', '#00AF00'],
  // Z = red
  ['#FF0000', '#DF0000', '#AF0000'],
  // L = orange
  ['#FFC500', '#FFA500', '#CF8500'],
  // J = blue
  ['#0000FF', '#0000DF', '#0000AF'],
  // T = purple
  ['#A000A0', '#800080', '#600060'],
];

export class BlockyBoard {
  /**
   *
   * @param {object} options
   * @param {BlockyState} options.state
   * @param {HTMLCanvasElement} options.boardCanvas
   * @param {number} options.blockSize
   * @param {HTMLCanvasElement} options.nextPieceCanvas
   * @param {number} options.nextPieceBlockSize
   */
  constructor({
    state = new BlockyState(),
    boardCanvas,
    blockSize = 32,
    nextPieceCanvas,
    nextPieceBlockSize = 24,
  }) {
    this._blockSize = blockSize;
    this._state = BlockyState.copy(state);
    this._game = new Blocky(this._state);
    this._board = boardCanvas;
    this._nextPieceBoard = nextPieceCanvas;
    this._nextPieceBlockSize = nextPieceBlockSize;
    this._game.setup();

    this._board.width = blockSize * this._state.cols;
    this._board.height = blockSize * this._state.rows;
    this._board.tabIndex = -1;

    if (this._nextPieceBoard) {
      this._nextPieceBoard.width = nextPieceBlockSize * 4;
      this._nextPieceBoard.height = nextPieceBlockSize * 4;
      this._nextPieceBoard.tabIndex = -1;
      // this.nextPieceBoardOrigin = new Coord(1, 1);
    }

    /**
     * Collection of cleanup hooks to run when this component is disposed.
     * @type {Array<() => void>}
     */
    this._disposeHooks = [
      () => this._game.dispose(),
    ];

    // ['PIECE_CREATE', 'PIECE_PLACED', 'LINE_CLEAR'].forEach((eventName) => {
    BlockyEvent.ALL.forEach((eventName) => {
      this._game.registerEventListener(eventName, (eventData) => {
        this.onEvent(eventData);
      });
    });

    this._keyListenersMap = {
      ArrowLeft: () => this._game.moveLeft(),
      ArrowRight: () => this._game.moveRight(),
      ArrowDown: () => this._game.moveDown(),
      Enter: () => {
        if (this._state.isGameOver) {
          this._game.setup();
        } else if (!this._state.hasStarted) {
          this._game.start();
        } else if (this._state.isPaused) {
          this._game.resume();
        } else {
          this._game.pause();
        }
      },
      Space: () => { }, // Disable spacebar scrolling
      z: () => this._game.rotateClockwise(),
      x: () => this._game.rotateCounterClockwise(),
    };

    const keyDownListener = (event) => {
      // console.log(`keyDownEvent: ${event.key}`);
      if (this._keyListenersMap[event.key]) {
        this._keyListenersMap[event.key]();
        event.preventDefault();
      }
    };
    this._board.onkeydown = keyDownListener;
    this._disposeHooks.push(() => this._board.onkeydown = null);

    this.render();
    // const boardContainer = document.createElement('div');
    // boardContainer.classList.add('blocky-board-container');
    // boardContainer.appendChild(this.board);

    // const container = document.createElement('div');
    // container.classList.add('blocky-container');
    // container.appendChild(boardContainer);

    // this.component = container;
  }

  dispose() {
    this._disposeHooks.forEach((hook) => hook());
  }

  get boardContext() {
    return this._board.getContext('2d');
  }

  get nextPieceContext() {
    return this._nextPieceBoard?.getContext('2d');
  }

  get shouldRenderPiece() {
    return (
      this._state.isRunning() &&
      !this._state.isPaused &&
      this._state.piece.isActive
    );
  }

  /**
   * @type {Blocky}
   */
  get game() {
    return this._game;
  }

  onEvent(event) {
    console.log(`onEvent: ${event.name}`);
    // console.log(JSON.stringify(event.data));
    // if (event.name === BlockyEvent.GAME_OVER.name) {
    //   console.log(JSON.stringify(event.data.state));
    // }
    // if (event.name === BlockyEvent.LEVEL_UPDATE.name ||
    //   event.name === BlockyEvent.SCORE_UPDATE.name ||
    //   event.name === BlockyEvent.START.name) {
    //   // updateLevelLabel();
    //   // updateScoreLabel();
    // }

    // if (event.name === BlockyEvent.PIECE_CREATE) {
    //   renderNextPiece();
    // }

    // mapStateToBoard();
    this.render();
    // renderNextPiece();
  }

  render() {
    // console.log('(blocky) render');
    const ctx = this.boardContext;
    const nextPieceCtx = this.nextPieceContext;

    if (!ctx) {
      console.error(`Blocky render error - canvas 2D context was null`);
      return;
    }

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this._board.width, this._board.height);
    if (nextPieceCtx) {
      nextPieceCtx.fillStyle = 'black';
      nextPieceCtx.fillRect(
        0, 0,
        this._nextPieceBoard.width, this._nextPieceBoard.height
      );
    }

    const board = this._state.board;

    // debug(JSON.stringify(this.state.piece));
    if (this.shouldRenderPiece) {
      this._state.piece.blockCoords.forEach((coord) => {
        const index = coord.row * this._state.cols + coord.col;
        board[index] = this._state.piece.shape.value;
      });

      // Render next piece view if the canvas exists
      const nextPieceCtx = this.nextPieceContext;
      if (nextPieceCtx) {
        const nextShape = this._state.getNextShape();
        nextShape.getRotation(0).forEach(coord => {
          this._renderNextPieceBlock(
            2 + coord.col + 4*(coord.row + 1),
            nextShape.value,
            nextPieceCtx
          );
        });
      }
    }

    board.forEach((block, index) => {
      // if (block > 0) {
        this._renderBlock(index, block, ctx);
      // }
    });

    //
  }

  _renderBlock(index, blockValue, ctx = this.boardContext) {
    // if (blockValue <= 0) { return; }

    const row = Math.floor(index / this._state.cols);
    const col = index % this._state.cols;
    const bs = this._blockSize;

    ctx.fillStyle = shapeColors[blockValue][1];
    if (this._state.isGameOver) ctx.fillStyle + '40';
    ctx.fillRect(col * bs, row * bs, bs, bs);

    ctx.fillStyle = shapeColors[blockValue][0];
    if (this._state.isGameOver) ctx.fillStyle + '40';
    ctx.fillRect(col * bs, row * bs, bs, 1);
    ctx.fillRect(col * bs, row * bs, 1, bs);

    ctx.fillStyle = shapeColors[blockValue][2];
    if (this._state.isGameOver) ctx.fillStyle + '40';
    ctx.fillRect(col * bs, (row + 1) * bs - 1, bs, 1);
    ctx.fillRect((col + 1) * bs - 1, row * bs, 1, bs);
  }

  _renderNextPieceBlock(index, blockValue, ctx = this.nextPieceContext) {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const bs = this._nextPieceBlockSize;

    ctx.fillStyle = shapeColors[blockValue][1];
    if (this._state.isGameOver) ctx.fillStyle + '40';
    ctx.fillRect(col * bs, row * bs, bs, bs);

    ctx.fillStyle = shapeColors[blockValue][0];
    if (this._state.isGameOver) ctx.fillStyle + '40';
    ctx.fillRect(col * bs, row * bs, bs, 1);
    ctx.fillRect(col * bs, row * bs, 1, bs);

    ctx.fillStyle = shapeColors[blockValue][2];
    if (this._state.isGameOver) ctx.fillStyle + '40';
    ctx.fillRect(col * bs, (row + 1) * bs - 1, bs, 1);
    ctx.fillRect((col + 1) * bs - 1, row * bs, 1, bs);
  }
}

export default BlockyBoard;
