export class StageSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StageSelectScene' });
        this.player;
        this.cursors;
        this.spaceKey;
        this.shiftKey;
        this.zKey;
        this.isStunned = false;
        this.atkDamage = 0;
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'Stages');
        this.physics.world.setBounds(-70, 0, 1430, 550); // 월드 경계 설정

        // 스테이지 선택 텍스트
        const noticeText = this.add.text(640, 80, 'CHOOSE A STAGE', {
            fontSize: '48px',
            color: '#FFD700', // 기본 금색
            fontFamily: 'HeirofLightBold',
            stroke: '#000000', // 검정색 외곽선
            strokeThickness: 5, // 외곽선 두께
        }).setOrigin(0.5, 0.5).setInteractive();

        // 스프라이트 시트 없이 개별 이미지를 애니메이션으로 구성
        const walkFrames = [];
        const walkFrames2 = [];
        for (let i=1; i <= 6; i++){
            walkFrames.push({ key: 'Reed_walk' + i });
            walkFrames2.push({ key: 'Aster_walk' + i });
        }

        // 애니메이션 정의
        this.anims.create({
            key: 'walk',
            frames: walkFrames,
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'walk2',
            frames: walkFrames2,
            frameRate: 12,
            repeat: -1
        });

        // 기본 스프라이트 설정
        this.player = this.physics.add.sprite(350, 200, 'Reed_walk1');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.27);
        this.player.setFlipX(true);

        this.partner = this.physics.add.sprite(300, 200, 'Aster_walk1');
        this.partner.setCollideWorldBounds(true);
        this.partner.setScale(0.24);
        this.partner.setFlipX(true);

        // 키보드 입력
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    }
    update(time, delta) {
        // 이동 처리
        if (this.cursors.right.isDown || this.isRightPressed) {
            this.player.setVelocityX(200);
            if (!this.player.anims.isPlaying) {
                this.player.anims.play('walk', true);
                this.partner.anims.play('walk2', true);
            }
            this.player.setFlipX(true);
            this.partner.setFlipX(true);

            this.tweens.add({
                targets: this.partner,
                x: this.player.x - 70,
                y: this.player.y,
                duration: 100,
                ease: 'Linear'
            });
        } else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-360);
            if (!this.player.anims.isPlaying) {
                this.player.anims.play('walk', true);
                this.partner.anims.play('walk2', true);
            }
            this.player.setFlipX(false);
            this.partner.setFlipX(false);

            this.tweens.add({
                targets: this.partner,
                x: this.player.x + 70,
                y: this.player.y,
                duration: 50,
                ease: 'Linear'
            });
        } else {
            this.player.setVelocityX(0);
            this.player.anims.stop();
            this.partner.anims.stop();
            this.player.setTexture('Reed_walk1');
            this.partner.setTexture('Aster_walk1');     
        }
    }
}
