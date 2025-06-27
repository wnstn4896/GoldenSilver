export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        const basePath = window.location.pathname.replace(/\/[^\/]*$/, '');
        const img = `${basePath}/assets/images`;
        const msg = `${basePath}/src/msgs`;
        const sound = `${basePath}/assets/sounds`;

        this.load.image('title', `${img}/title.png`);
        for (let i = 1; i <= 7; i++)
            this.load.image('prologue' + i, `${img}/prologue` + i + '.png');

        this.load.image('testField', `${img}/testField.png`);


        // 플레이어 캐릭터 - 걷는 동작 - 6 프레임 로드
        for (let i=1; i <= 6; i++) {
            this.load.image('Reed_walk' + i, `${img}/Reed_walk` + i + '.png');
            this.load.image('Aster_walk' + i, `${img}/Aster_walk` + i + '.png');
        }
        // 플레이어 캐릭터 - 점프 동작 - 3 프레임 로드
        for (let i=1; i<=3; i++){
            this.load.image('Reed_jump' + i, `${img}/Reed_jump` + i + '.png');
            this.load.image('Aster_jump' + i, `${img}/Aster_jump` + i + '.png');
        }

        // 대사 메시지 JSON 로드
        this.load.json('PrologueDialogues', `${msg}/Prologue.json`);

        // 사운드 로드
        this.load.audio('prologueBGM', [`${sound}/prologue.mp3`]);  
    }

    create() {
        // 타이틀 화면 이동
        this.scene.start('TitleScene');
    }
}
