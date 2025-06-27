import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { PrologueScene } from './scenes/PrologueScene.js';
import { FieldScene } from './scenes/FieldScene.js';

document.oncontextmenu = function(e){
    return false;
}

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    transparent: true, // 캔버스 배경을 투명하게 설정
    scene: [BootScene, TitleScene, PrologueScene, FieldScene], // 모든 Scene 등록
    scale: {
        mode: Phaser.Scale.FIT, // 디바이스 화면에 맞게 비율 조정
        autoCenter: Phaser.Scale.CENTER_BOTH, // 화면 중앙 정렬
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    input: {
        activePointers: 4,
    },
};

new Phaser.Game(config);
