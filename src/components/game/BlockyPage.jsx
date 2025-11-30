import React, { useEffect, useRef, useState } from 'react';
import BlockyBoard from './BlockyBoard';
import classNames from 'classnames';

// TODO FOR UI:
// Add popover frame for sizing / game options when gear icon clicked:
//    cell size, numRows, numCols
//    color schema (colors per level)
//    keybinds
// Lockdown controls when game is in progress and not paused.
// Add score
// Add piece distribution (maybe)
// Add indication of game over / paused
// Record user's high scores in local storage
// Add playback

// TODO FOR GAME:
// Record history (maybe through event log)
// Smoother controls

export function BlockyPage({}) {
  /** @type {React.RefObject<HTMLCanvasElement>} */
  const gameBoardCanvasRef = useRef(null);
  /** @type {React.RefObject<HTMLCanvasElement>} */
  const nextPieceCanvasRef = useRef(null);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    const boardCanvas = gameBoardCanvasRef.current;
    const nextPieceCanvas = nextPieceCanvasRef.current;
    const boardController = new BlockyBoard({ boardCanvas, nextPieceCanvas });
    boardCanvas.focus();

    boardCanvas.onfocus = (ev) => {
      boardCanvas.classList.add('game-focus');
      nextPieceCanvas.classList.add('game-focus');
    };
    boardCanvas.onblur = (ev) => {
      boardCanvas.classList.remove('game-focus');
      nextPieceCanvas.classList.remove('game-focus');
      if (boardController.game.state.isRunning()) {
        boardController.game.pause();
      }
    };
    nextPieceCanvas.onfocus = (ev) => {
      boardCanvas.focus();
    };

    boardController.game.registerEventListener('LEVEL_UPDATE', (ev) => {
      console.log(JSON.stringify(ev));
      setLevel(ev.data._level);
    });

  }, [gameBoardCanvasRef, nextPieceCanvasRef]);

  return (
    <div className='blocky-page pt-- px----'>
      <h1 className='title py--'>BLOCKY</h1>
      <div className='flex-horizontal center items-start'>
        <i className='options-btn pt-- fa-solid fa-gear fa-lg'></i>
        <div className='px--'>
          <canvas ref={gameBoardCanvasRef} className='blocky-canvas' autoFocus></canvas>
        </div>
        <div className='flex-vertical items-center'>
          <p>Next Piece</p>
          <canvas
            ref={nextPieceCanvasRef}
            className='blocky-next-piece-canvas'
          ></canvas>
          <p className='pt-'>Level {level}</p>
        </div>
      </div>

      <p className='pt---'>Click within the game area above.</p>
      <p>Hit <span className='gold'>'ENTER'</span> for start/pause/resume.</p>
      <p>Move with <span className='primary'>arrow keys</span>.</p>
      <p>Rotate with <span className='gold'>'Z'</span> and <span className='gold'>'X'</span>.</p>
    </div>
  );
}

export default BlockyPage;
