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

        for (let i = 1; i <= 3; i++)
            this.load.image('Reeds_Room' + i, `${img}/Reeds_Room` + i + '.png');

        this.load.image('testField', `${img}/testField.png`);

        this.load.image('TutorialField', `${img}/TutorialField.png`);
        this.load.image('TutorialBossField', `${img}/TutorialBossField.png`);

        this.load.image('Tuto_standing', `${img}/Tuto_standing.png`);
        this.load.image('Tuto_defeated', `${img}/Tuto_defeated.png`);


        this.load.image('attack_effect', `${img}/attack_effect.png`);

        
        // 모바일용 버튼 이미지 정의
        this.load.image('left_btn', `${img}/left_button.png`);
        this.load.image('right_btn', `${img}/right_button.png`);
        this.load.image('jump_btn', `${img}/jump_button.png`);
        this.load.image('attack_btn', `${img}/attack_button.png`);

        // 애니메이션 프레임 정의
        for (let i=1; i <= 6; i++) {
            this.load.image('Reed_walk' + i, `${img}/Reed_walk` + i + '.png');
            this.load.image('Aster_walk' + i, `${img}/Aster_walk` + i + '.png');
            this.load.image('Tuto_walk' + i, `${img}/Tuto_walk` + i + '.png');
        }
        for (let i=1; i<=3; i++){
            this.load.image('Reed_jump' + i, `${img}/Reed_jump` + i + '.png');
            this.load.image('Aster_jump' + i, `${img}/Aster_jump` + i + '.png');
            this.load.image('Reed_attack' + i, `${img}/Reed_attack` + i + '.png');
            this.load.image('Aster_attack' + i, `${img}/Aster_attack` + i + '.png');
        }

        // 대사 메시지 JSON 로드
        this.load.json('PrologueDialogues', `${msg}/Prologue.json`);

        // 사운드 로드
        this.load.audio('prologueBGM', [`${sound}/prologue.mp3`]);

        // 효과음
        this.load.audio('sfx_attack', [`${sound}/sfx_attack.wav`]);
        this.load.audio('sfx_jump', [`${sound}/sfx_jump.wav`]);
        this.load.audio('sfx_jump2', [`${sound}/sfx_jump2.mp3`]);
        this.load.audio('sfx_jumpattack', [`${sound}/sfx_jumpattack.ogg`]);
        this.load.audio('Tuto_damaged', [`${sound}/Tuto_damaged.wav`]);
    }

    create() {
        // 타이틀 화면 이동
        this.scene.start('TitleScene');
    }
}
