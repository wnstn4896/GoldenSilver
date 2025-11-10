import { MessageModule } from './MessageModule.js';

export class TestScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TestScene' });
        this.player;
        this.cursors;
        this.spaceKey;
        this.shiftKey;
        this.zKey;
        this.jumpHeight = -380;    // 점프 높이
        this.gravity = 450;       // 중력 값
        this.jumpCooldown = 0;    // 점프 쿨타임 초기화 (초기값 0)
        this.jumpCooldownTime = 1750; // 쿨타임 시간 (밀리초)
        this.attackCooldown = 0;
        this.attackCooldownTime = 750;
        this.isStunned = false;
        this.atkDamage = 0;

        this.isLeftPressed = false;
        this.isRightPressed = false;
        this.isJumpPressed = false;
        this.isAtkPressed = false;

        // 대사 출력 관련
        this.dialogues = [];
        this.currentIndex = 0;
        this.MessageModule;
        this.isMessages;
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'Forest');
        this.physics.world.setBounds(-70, 0, 1430, 550); // 월드 경계 설정

        // 스프라이트 시트 없이 개별 이미지를 애니메이션으로 구성
        const walkFrames = [];
        const jumpFrames = [];
        const attackFrames = [];
        for (let i = 1; i <= 6; i++) {
            walkFrames.push({ key: 'Reed_walk' + i });
        }
        for (let i = 1; i <= 3; i++) {
            jumpFrames.push({ key: 'Reed_jump' + i });
            attackFrames.push({ key: 'Reed_attack' + i });
        }

        // 애니메이션 정의
        this.anims.create({
            key: 'walk',
            frames: walkFrames,
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
            key: 'attack',
            frames: attackFrames,
            frameRate: 10,
            repeat: 0
        });

        const horseFrames = [];
        for (let i = 1; i <= 6; i++) {
            horseFrames.push({ key: 'Reed_Horse' + i });
        }
        this.anims.create({
            key: 'horse',
            frames: horseFrames,
            frameRate: 12,
            repeat: -1
        });


        // 기본 스프라이트 설정
        this.player = this.physics.add.sprite(150, 500, 'Reed_walk1');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.27);
        this.player.setFlipX(true);
        this.player.setGravityY(this.gravity);  // 중력 설정

        // 모바일 환경 감지
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
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

        // 공격 이펙트 (실질적 공격 판정 범위)
        this.playerAttacks = this.physics.add.group();

        // 키보드 입력
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        // 공격 판정 충돌 처리
        this.physics.add.overlap(this.playerAttacks, this.enemies, this.handlePlayerAttackHit, null, this);

        // 대사 출력 관련 모듈 정의
        this.MessageModule = new MessageModule(this);
        this.MessageModule.createUI();
        this.MessageModule.hideUI();

        // 대화창 조작 안내 텍스트
        this.uiElements = {};

        this.uiElements.controlsText = this.add.text(910, 620, '(Press [SPACE] OR Click)', {
            fontSize: '16px',
            fontFamily: 'HeirofLightRegular',
            color: '#ffffff',
            padding: { top: 2, bottom: 2 },
        });
        this.uiElements.controlsText.setVisible(false);

        this.dialogues = this.cache.json.get('TutorialDialogues');
    }

    // 대사 출력 관련 함수
    showDialogue() {
        this.physics.pause(); // 물리엔진 정지
        this.uiElements.controlsText.setVisible(true);
        this.isMessages = true;

        const dialogue = this.dialogues[this.currentIndex];

        if (this.currentIndex < this.dialogues.length && !dialogue.stop) {
            this.MessageModule.updateDialogue(dialogue, () => {
                this.currentIndex++;
                this.showDialogue();
            });
        }
        else if (this.currentIndex < this.dialogues.length && dialogue.stop) {
            this.currentIndex++;
            this.endDialogue();
        }
        else {
            this.endDialogue();
        }
    }
    endDialogue() {
        this.isStunned = true;

        this.uiElements.controlsText.setVisible(false);
        this.MessageModule.hideUI(); // 대사 UI 숨기기
        this.physics.resume(); // 물리엔진 재가동
        this.isMessages = false;

        // 점프 동작 겹침 방지
        this.time.delayedCall(100, () => {
            this.isStunned = false;
        });
    }

    update(time, delta) {
        this.player.setScale(0.5);
        this.background.tilePositionX += 10;
        this.player.anims.play('horse', true);

        // 공격(석궁) 처리
        if ((this.zKey.isDown || this.isAtkPressed) && this.attackCooldown <= 0) {
            this.attackCooldown = this.attackCooldownTime;
            this.sound.add('sfx_crossbow').setVolume(0.5).play();

            const attackEffect = this.playerAttacks.create(this.player.x + 70, this.player.y - 30, 'arrow');
            attackEffect.setFlipX(!this.player.flipX);
            attackEffect.setScale(2);
            attackEffect.setVelocityX(900);
        }

        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }

        // 점프(승마 상태) 처리
        if ((this.spaceKey.isDown || this.isJumpPressed) && this.jumpCooldown <= 0) {
            this.sound.add('sfx_jump').setVolume(0.6).play();
            this.jumpCooldown = this.jumpCooldownTime;  // 쿨타임 시작
            this.time.delayedCall(100, () => {
                this.player.setVelocityY(this.jumpHeight);  // 점프 높이 설정
            });
        }
    
        if (!this.player.body.onFloor()) {
            this.player.anims.stop();
        }
    
        // 점프 쿨타임 처리
        if (this.jumpCooldown > 0) {
            this.jumpCooldown -= delta;
        }

        /**
    
        const isOnGround = this.player.body.onFloor();  // 점프 중 상태 판별
    
        // 이동 처리
        if ((this.cursors.right.isDown || this.isRightPressed) && this.attackCooldown <= 200 && !this.isStunned && !this.isMessages) {
            if (this.mapCount < 1) {
                this.background.tilePositionX += 3;
                this.player.setVelocityX(200);
            } else if (this.mapCount >= 1) {
                this.player.setVelocityX(360);
            }
            if (isOnGround && !this.player.anims.isPlaying) {
                this.player.anims.play('walk', true);
            }
            this.player.setFlipX(true);
        } else if ((this.cursors.left.isDown || this.isLeftPressed) && this.attackCooldown <= 200 && !this.isStunned && !this.isMessages) {
            this.player.setVelocityX(-360);
            if (isOnGround && !this.player.anims.isPlaying) {
                this.player.anims.play('walk', true);
            }
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
            if (isOnGround && this.jumpCooldown <= 0 && this.attackCooldown <= 0 && !this.isStunned) {
                this.player.anims.stop();
                this.player.setTexture('Reed_walk1');
            }
        }
    
        // 점프 처리
        if (isOnGround && (this.spaceKey.isDown || this.isJumpPressed) && this.jumpCooldown <= 0 && !this.isStunned && !this.isMessages) {
            this.sound.add('sfx_jump').setVolume(0.6).play();
            this.sound.add('sfx_jump2').setVolume(0.2).play();
            this.player.anims.play('jump', true);
            this.jumpCooldown = this.jumpCooldownTime;  // 쿨타임 시작
            this.time.delayedCall(100, () => {
                this.player.setVelocityY(this.jumpHeight);  // 점프 높이 설정
            });
        }
    
        if (!isOnGround && this.jumpCooldown <= 120 && !this.isStunned) {
            this.player.anims.stop();
            this.player.setTexture('Reed_jump3');
        }
    
        // 점프 쿨타임 처리
        if (this.jumpCooldown > 0) {
            this.jumpCooldown -= delta;
        }
    
        // 평타 공격
        if ((this.zKey.isDown || this.isAtkPressed) && this.attackCooldown <= 0 && !this.isStunned && !this.isMessages) {
            this.attackCooldown = this.attackCooldownTime;
            // 내려찍기
            if (!isOnGround) {
                this.isStunned = true;
                this.player.anims.stop();
    
                this.player.setVelocityY(800);
                this.sound.add('sfx_attack').setVolume(0.5).play();
    
                this.time.delayedCall(250, () => {
                    this.atkDamage = 50;
    
                    const attackEffect = this.playerAttacks.create(this.player.flipX ? this.player.x + 40 : this.player.x - 40, this.player.y, 'attack_effect');
                    attackEffect.setFlipX(!this.player.flipX);
                    attackEffect.setScale(5.5);
                    if (this.player.flipX) {
                        attackEffect.setVelocityX(60);
                    }
                    else {
                        attackEffect.setVelocityX(-60);
                    }
                    this.time.delayedCall(500, () => {
                        this.playerAttacks.clear(true);
                    });
    
                    this.sound.add('sfx_jumpattack').setVolume(0.7).play();
                });
    
                this.time.delayedCall(1000, () => {
                    this.atkDamage = 0;
                    this.isStunned = false;
                });
            } else {
                this.atkDamage = 25;
                this.sound.add('sfx_attack').setVolume(0.5).play();
    
                const attackEffect = this.playerAttacks.create(this.player.flipX ? this.player.x + 40 : this.player.x - 40, this.player.y, 'attack_effect');
                attackEffect.setFlipX(!this.player.flipX);
                attackEffect.setScale(4.5);
                if (this.player.flipX)
                    attackEffect.setVelocityX(30);
                else
                    attackEffect.setVelocityX(-30);
                this.time.delayedCall(500, () => {
                    this.atkDamage = 0;
                    this.playerAttacks.clear(true);
                });
            }
            this.player.anims.play('attack', true);
        }
        // 평타 쿨타임 처리
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }
        */
    }
}
