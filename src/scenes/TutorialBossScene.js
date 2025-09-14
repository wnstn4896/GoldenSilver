export class TutorialBossScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialBossScene' });
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
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'TutorialBossField');
        this.physics.world.setBounds(-70, 0, 1430, 550); // 월드 경계 설정

        // 스프라이트 시트 없이 개별 이미지를 애니메이션으로 구성
        const walkFrames = [];
        const walkFrames2 = [];
        const jumpFrames = [];
        const jumpFrames2 = [];
        const attackFrames = [];
        const attackFrames2 = [];
        const enemyFrames = [];
        for (let i=1; i <= 6; i++){
            walkFrames.push({ key: 'Reed_walk' + i });
            walkFrames2.push({ key: 'Aster_walk' + i });
            enemyFrames.push({ key: 'Tuto_walk' + i});
        }
        for (let i=1; i<=3; i++){
            jumpFrames.push({ key: 'Reed_jump' + i});
            jumpFrames2.push({ key: 'Aster_jump' + i});

            attackFrames.push({ key: 'Reed_attack' + i});
            attackFrames2.push({ key: 'Aster_attack' + i});
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
        this.anims.create({
            key: 'attack2',
            frames: attackFrames2,
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'Tuto_walk',
            frames: enemyFrames,
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
        this.partner.setGravityY(this.gravity);  // 중력 설정

         // 모바일 환경 감지
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

        // 공격 이펙트 (실질적 공격 판정 범위)
        this.playerAttacks = this.physics.add.group();

        // 적 생성
        this.enemies = this.physics.add.group({
            key: 'Tuto_walk1',
            repeat: 0, // 적 1개만 생성
            setXY: { x: 900, y: 550 },
        });
        this.enemies.children.iterate((enemy) => {
            enemy.setScale(0.29);
            enemy.setCollideWorldBounds(true); // 월드 경계 밖으로 못 나가게 설정
            enemy.setBounce(1); // 충돌 시 반전
            enemy.setGravityY(this.gravity);

            // 체력 추가
            enemy.maxHp = 100;
            enemy.hp = 100;

            // 체력바 생성
            enemy.healthBar = this.add.graphics();
            this.updateEnemyHPBar(enemy);
        });


        // 키보드 입력
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        // 공격 판정 충돌 처리
        this.physics.add.overlap(this.playerAttacks, this.enemies, this.handlePlayerAttackHit, null, this);
    }

    updateEnemyHPBar(enemy){
            if (!enemy.healthBar) return;

            const barWidth = 40;
            const barHeight = 6;
            const x = enemy.x - barWidth / 2;
            const y = enemy.y - 50;

            enemy.healthBar.clear();
            enemy.healthBar.fillStyle(0x000000, 1);
            enemy.healthBar.fillRect(x - 1, y - 1, barWidth + 2, barHeight + 2); // 테두리

            enemy.healthBar.fillStyle(0xff0000, 1);
            const healthPercent = Phaser.Math.Clamp(enemy.hp / enemy.maxHp, 0, 1);
            enemy.healthBar.fillRect(x, y, barWidth * healthPercent, barHeight);
        }


        handlePlayerAttackHit(attack, enemy) {
            if (!enemy.hp || enemy.hp <= 0) return;

            // 데미지 적용
            enemy.hp -= this.atkDamage;
            this.updateEnemyHPBar(enemy);
            this.sound.add('Tuto_damaged').setVolume(0.6).play();

            // 적 체력 0이면 사망 처리
            if (enemy.hp <= 0) {
                this.cameras.main.flash(300, 255, 255, 255);
                enemy.healthBar.destroy(); // 체력바 제거
                enemy.destroy();           // 적 제거
            }

            // 공격 이펙트 제거
            attack.destroy();
        }

    update(time, delta) {
        const isOnGround = this.player.body.onFloor();  // 점프 중 상태 판별
        // 이동 처리
        if ((this.cursors.right.isDown || this.isRightPressed) && this.attackCooldown <= 200 && !this.isStunned) {
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
        } else if ((this.cursors.left.isDown || this.isLeftPressed) && this.attackCooldown <= 200 && !this.isStunned) {
            this.player.setVelocityX(-360);
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
            if (isOnGround && this.jumpCooldown <= 0 && this.attackCooldown <= 0 && !this.isStunned) {
                this.player.anims.stop();
                this.partner.anims.stop();
                this.player.setTexture('Reed_walk1');
                this.partner.setTexture('Aster_walk1');
            }       
        }

        this.enemies.children.iterate((enemy) => {
            /*
            if (enemy.x > this.player.x || enemy.x < this.partner.x)
                enemy.setFlipX(false);
            else
                enemy.setFlipX(true);
            enemy.setVelocityX(enemy.flipX ? 100 : -100);
                
            enemy.anims.play('Tuto_walk', true);
            */

            // 체력바 갱신
            this.updateEnemyHPBar(enemy);
        });

        // 점프 처리
        if ((this.spaceKey.isDown || this.isJumpPressed) && this.jumpCooldown <= 0 && !this.isStunned) {
            this.sound.add('sfx_jump').setVolume(0.6).play();
            this.sound.add('sfx_jump2').setVolume(0.2).play();
            this.player.anims.play('jump', true);
            this.partner.anims.play('jump2', true);
            this.jumpCooldown = this.jumpCooldownTime;  // 쿨타임 시작
            this.time.delayedCall(100, () => {
                this.player.setVelocityY(this.jumpHeight);  // 점프 높이 설정
                this.partner.setVelocityY(this.jumpHeight);  // 점프 높이 설정
            });
        }

        if (!isOnGround && this.jumpCooldown <= 120 && !this.isStunned){
            this.player.anims.stop();
            this.partner.anims.stop();
            this.player.setTexture('Reed_jump3');
            this.partner.setTexture('Aster_jump3');
        }

        // 점프 쿨타임 처리
        if (this.jumpCooldown > 0) {
            this.jumpCooldown -= delta;
        }

        // 평타 공격
        if ((this.zKey.isDown || this.isAtkPressed) && this.attackCooldown <= 0 && !this.isStunned){
            this.attackCooldown = this.attackCooldownTime;
            this.partner.anims.stop();
            // 내려찍기
            if (!isOnGround){
                this.isStunned = true;
                this.player.anims.stop();
                this.partner.setFlipX(!this.player.flipX);
                
                this.player.setVelocityY(800);
                this.partner.setVelocityY(800);
                this.sound.add('sfx_attack').setVolume(0.5).play();

                this.time.delayedCall(250, () => {
                    this.atkDamage = 50;
                    this.partner.setScale(0.26);
                    this.partner.anims.play('attack2', true);
                    this.partner.setY(600);

                    const attackEffect = this.playerAttacks.create(this.player.flipX ? this.player.x + 40 : this.player.x - 40, this.player.y, 'attack_effect');
                    const attackEffect2 =  this.playerAttacks.create(this.partner.flipX ? this.partner.x + 40 : this.partner.x - 40, this.player.y, 'attack_effect');
                    attackEffect.setFlipX(!this.player.flipX);
                    attackEffect.setScale(5.5);
                    attackEffect2.setFlipX(!this.partner.flipX);
                    attackEffect2.setScale(5.5);
                    if (this.player.flipX){
                        attackEffect.setVelocityX(60);
                        attackEffect2.setVelocityX(-80);
                    }
                    else{
                        attackEffect.setVelocityX(-60);
                        attackEffect2.setVelocityX(80);
                    }
                    this.time.delayedCall(500, () => {
                        this.playerAttacks.clear(true);
                    });

                    this.sound.add('sfx_jumpattack').setVolume(0.7).play();
                });

                this.time.delayedCall(1000, () => {
                    this.atkDamage = 0;
                    this.partner.anims.stop();
                    this.partner.setTexture('Aster_jump2');
                    this.partner.setScale(0.24);
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

        /* 맵 스크롤
        if (this.player.x > 1300){
            this.cameras.main.flash(300, 0, 0, 0);
            this.player.setPosition(-80, 500);
            this.partner.setVisible(false);
            this.time.delayedCall(300, () => {
                this.partner.setVisible(true);
            });
        }
        */
    }
}
