export class FieldScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FieldScene' });
        this.player;
        this.cursors;
        this.spaceKey;
        this.zKey;
        this.jumpSpeed = -380;    // 점프 속도 (음수 값)
        this.gravity = 450;       // 중력 값
        this.jumpCooldown = 0;    // 점프 쿨타임 초기화 (초기값 0)
        this.jumpCooldownTime = 1750; // 쿨타임 시간 (밀리초)
        this.attackCooldown = 0;
        this.attackCooldownTime = 750;

        this.isLeftPressed = false;
        this.isRightPressed = false;
        this.isJumpPressed = false;
        this.isAtkPressed = false;
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'testField');
        this.physics.world.setBounds(-70, 0, 1430, 550); // 월드 경계 설정

        // 스프라이트 시트 없이 개별 이미지를 애니메이션으로 구성
        const walkFrames = [];
        const walkFrames2 = [];
        const jumpFrames = [];
        const jumpFrames2 = [];
        const attackFrames = [];
        for (let i=1; i <= 6; i++){
            walkFrames.push({ key: 'Reed_walk' + i });
            walkFrames2.push({ key: 'Aster_walk' + i });
        }
        for (let i=1; i<=3; i++){
            jumpFrames.push({ key: 'Reed_jump' + i});
            jumpFrames2.push({ key: 'Aster_jump' + i});

            attackFrames.push({ key: 'Reed_attack' + i});
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
        this.anims.create({
            key: 'jump',
            frames: jumpFrames,
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'jump2',
            frames: jumpFrames2,
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'attack',
            frames: attackFrames,
            frameRate: 10,
            repeat: 0
        });

        // 기본 스프라이트 설정
        this.player = this.physics.add.sprite(150, 500, 'Reed_walk1');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.27);
        this.player.setFlipX(true);
        this.player.setGravityY(this.gravity);  // 중력 설정

        this.partner = this.physics.add.sprite(50, 550, 'Aster_walk1');
        this.partner.setCollideWorldBounds(true);
        this.partner.setScale(0.24);
        this.partner.setFlipX(true);

         // 환경 감지: PC인지 모바일인지 확인
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile){
            // 왼쪽 버튼
            this.leftButton = this.add.tileSprite(140, 640, 210, 220, 'left_btn').setOrigin(1.0, 0.5).setInteractive();
            this.leftButton.setScale(0.4);
            this.leftButton.on('pointerdown', () => this.isLeftPressed = true);
            this.leftButton.on('pointerup', () => this.isLeftPressed = false);
            this.leftButton.on('pointerout', () => this.isLeftPressed = false);

            // 오른쪽 버튼
            this.rightButton = this.add.tileSprite(240, 640, 210, 220, 'right_btn').setOrigin(1.0, 0.5).setInteractive();
            this.rightButton.setScale(0.4);
            this.rightButton.on('pointerdown', () => this.isRightPressed = true);
            this.rightButton.on('pointerup', () => this.isRightPressed = false);
            this.rightButton.on('pointerout', () => this.isRightPressed = false);

            // 점프 버튼
            this.jumpButton = this.add.tileSprite(1050, 640, 210, 220, 'jump_btn').setOrigin(1.0, 0.5).setInteractive();
            this.jumpButton.setScale(0.5);
            this.jumpButton.on('pointerdown', () => this.isJumpPressed = true);
            this.jumpButton.on('pointerup', () => this.isJumpPressed = false);
            this.jumpButton.on('pointerout', () => this.isJumpPressed = false);

            // 공격 버튼
            this.atkButton = this.add.tileSprite(1200, 640, 210, 220, 'attack_btn').setOrigin(1.0, 0.5).setInteractive();
            this.atkButton.setScale(0.4);
            this.atkButton.on('pointerdown', () => this.isAtkPressed = true);
            this.atkButton.on('pointerup', () => this.isAtkPressed = false);
            this.atkButton.on('pointerout', () => this.isAtkPressed = false);
        }

        // 키보드 입력
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    update(time, delta) {
        const isOnGround = this.player.body.onFloor();  // 점프 중 상태 판별
        // 이동 처리
        if ((this.cursors.right.isDown || this.isRightPressed) && this.attackCooldown <= 200) {
            this.background.tilePositionX += 3;
            this.player.setVelocityX(160);
            if (isOnGround && !this.player.anims.isPlaying) {
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
        } else if ((this.cursors.left.isDown || this.isLeftPressed) && this.attackCooldown <= 200) {
            this.background.tilePositionX -= 3;
            this.player.setVelocityX(-160);
            if (isOnGround && !this.player.anims.isPlaying) {
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
            if (isOnGround && this.jumpCooldown <= 0 && this.attackCooldown <= 0) {
                this.player.anims.stop();
                this.partner.anims.stop();
                this.player.setTexture('Reed_walk1');
                this.partner.setTexture('Aster_walk1');
            }
        }

        // 점프 처리
        if ((this.spaceKey.isDown || this.isJumpPressed) && this.jumpCooldown <= 0) {
            this.player.anims.play('jump', true);
            this.partner.anims.play('jump2', true);
            this.jumpCooldown = this.jumpCooldownTime;  // 쿨타임 시작
            this.time.delayedCall(100, () => {
                this.player.setVelocityY(this.jumpSpeed);  // 점프 속도 설정
            });
        }

        if (!isOnGround && this.jumpCooldown <= 120){
            this.player.anims.stop();
            this.partner.anims.stop();
            this.player.setTexture('Reed_jump3');
            this.partner.setTexture('Aster_jump3');
            this.partner.setVelocityY(this.player.y);
        }

        // 점프 쿨타임 처리
        if (this.jumpCooldown > 0) {
            this.jumpCooldown -= delta;
            this.tweens.add({
                targets: this.partner,
                y: this.player.y,
                duration: 50,
                ease: 'Linear'
            });
        }

        // 평타 공격
        if ((this.zKey.isDown || this.isAtkPressed) && this.attackCooldown <= 0){
            this.attackCooldown = this.attackCooldownTime;
            this.partner.anims.stop();
            this.partner.setTexture('Aster_walk1');
            this.player.anims.play('attack', true);
        }

        // 평타 쿨타임 처리
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }
    }
}
