
import { GameManager } from "./modules/GameManager";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const game = new GameManager(canvas);

// when click on button class "toggle-menu" show menu
(document.querySelector('.toggle-menu') as HTMLElement).addEventListener('click', () => {
    // style display none or block
    (document.querySelector('.stats') as HTMLElement).style.display = (document.querySelector('.stats') as HTMLElement).style.display === 'none' ? 'block' : 'none';

})
