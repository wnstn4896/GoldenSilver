export class StageSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StageSelectScene' });
        this.player;
        this.spaceKey;

        // 월드맵 간 이동 관련
        this.isAutoMove = false;
        this.targetX = null;
        this.targetY = null;
        this.autoSpeed = 360;

        // 스테이지 선택 관련
        this.select = 0;
        this.stage;
        this.stageClear = Number(sessionStorage.getItem("stageClear")) || 0;
        this.isBtnPressed;
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'Stages');
        this.physics.world.setBounds(-70, 0, 1430, 600); // 월드 경계 설정

        // 스테이지 선택 텍스트
        const noticeText = this.add.text(640, 80, 'CHOOSE A STAGE', {
            fontSize: '48px',
            color: '#FFD700', // 금색
            fontFamily: 'HeirofLightBold',
            stroke: '#000000', // 검정색 외곽선
            strokeThickness: 5, // 외곽선 두께
        }).setOrigin(0.5, 0.5).setInteractive();
        this.stageText = this.add.text(640, 140, '', {
            fontSize: '36px',
            color: '#C0C0C0',  // 은색
            fontFamily: 'HeirofLightBold',
            stroke: '#000000', // 검정색 외곽선
            strokeThickness: 3, // 외곽선 두께
        }).setOrigin(0.5, 0.5).setInteractive();

        // 점프 버튼
        this.Button = this.add.tileSprite(675, this.stageText.y + this.stageText.height / 2 + 40, 210, 220, 'jump_btn').setOrigin(1.0, 0.5).setInteractive();
        this.Button.setScale(0.3);
        this.Button.on('pointerdown', () => this.isBtnPressed = true);
        this.Button.on('pointerup', () => this.isBtnPressed = false);
        this.Button.on('pointerout', () => this.isBtnPressed = false);
        this.Button.setVisible(false);

        // 스프라이트 시트 없이 개별 이미지를 애니메이션으로 구성
        const walkFrames = [];
        const walkFrames2 = [];
        for (let i = 1; i <= 6; i++) {
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

        this.defaultIcon = this.add.sprite(325, 200, 'StageIcon').setInteractive();
        this.defaultIcon.on('pointerdown', () => {
            this.startAutoMove(this.defaultIcon.x, this.defaultIcon.y);
            this.select = 0;
        });

        this.stage1Icon = this.add.sprite(500, 350, 'StageIcon').setInteractive();
        this.stage1Icon.on('pointerdown', () => {
            this.startAutoMove(this.stage1Icon.x, this.stage1Icon.y);
            this.select = 1;
        });

        this.stage2Icon = this.add.sprite(1025, 550, 'StageIcon').setInteractive();
        this.stage2Icon.on('pointerdown', () => {
            this.startAutoMove(this.stage2Icon.x, this.stage2Icon.y);
            this.select = 2;
        });

        this.stage3Icon = this.add.sprite(900, 220, 'StageIcon').setInteractive();
        this.stage3Icon.on('pointerdown', () => {
            this.startAutoMove(this.stage3Icon.x, this.stage3Icon.y);
            this.select = 3;
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
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    startAutoMove(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.isAutoMove = true;

        // 방향 바라보기
        if (this.targetX > this.player.x) {
            this.player.setFlipX(true);
            this.partner.setFlipX(true);
        } else {
            this.player.setFlipX(false);
            this.partner.setFlipX(false);
        }

        this.player.anims.play('walk', true);
        this.partner.anims.play('walk2', true);
    }

    update(time, delta) {
        if (this.isAutoMove) {
            let dx = this.targetX - this.player.x;
            let dy = this.targetY - this.player.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 5) {
                // 도착
                this.player.setVelocity(0, 0);
                this.partner.setVelocity(0, 0);

                this.player.anims.stop();
                this.partner.anims.stop();

                this.player.setTexture("Reed_walk1");
                this.partner.setTexture("Aster_walk1");

                this.isAutoMove = false;

                this.Button.setVisible(true);

                switch (this.select) {
                    case 0:
                        this.stageText.setText("Tutorial");
                        this.stage = null;
                        break;
                    case 1:
                        this.stageText.setText("Stage 1");
                        this.stage = 'Stage1FieldScene';
                        break;
                    case 2:
                        this.stageText.setText("Stage 2");
                        this.stage = 'Stage2FieldScene';
                        break;
                    case 3:
                        this.stageText.setText("Final Stage");
                        this.stage = 'HorseBattleScene';
                        break;
                }

                return;
            }

            let nx = dx / dist;
            let ny = dy / dist;

            this.player.setVelocity(nx * this.autoSpeed, ny * this.autoSpeed);

            if (nx > 0) {
                this.player.setFlipX(true);
                this.partner.setFlipX(true);
            } else {
                this.player.setFlipX(false);
                this.partner.setFlipX(false);
            }

            this.partner.setVelocity(
                (this.player.x - this.partner.x) * 3,
                (this.player.y - this.partner.y) * 3
            );

            if (!this.player.anims.isPlaying) {
                this.player.anims.play("walk", true);
                this.partner.anims.play("walk2", true);
            }

            return;
        }

        this.player.setVelocity(0, 0);
        this.partner.setVelocity(0, 0);

        // 목적지 도착 후 선택 키 입력 시 해당 씬으로 전환
        if ((this.isBtnPressed || this.spaceKey.isDown) && this.select != 0 && this.scene.get(this.stage))
            this.scene.start(this.stage);
        if ((this.isBtnPressed || this.spaceKey.isDown) && !this.scene.get(this.stage))
            alert('미완성');
    }
}
