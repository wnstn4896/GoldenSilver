export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
        this.stageClear = Number(sessionStorage.getItem("stageClear")) || 0;
    }

    create() {
        // 배경 추가
        this.title = this.add.tileSprite(640, 360, 1280, 720, 'title');

        // "게임 시작" 버튼 텍스트
        const startText = this.add.text(905, 520, '게임 시작', {
            fontSize: '48px',
            color: '#FFD700', // 기본 금색
            fontFamily: 'HeirofLightBold',
            stroke: '#000000', // 검정색 외곽선
            strokeThickness: 5, // 외곽선 두께
        }).setOrigin(0.5, 0.5).setInteractive();

        // 텍스트 등장 애니메이션
        startText.setAlpha(0); // 처음에는 보이지 않음
        this.tweens.add({
            targets: startText,
            alpha: 1,
            duration: 1000, // 1초 동안 서서히 등장
            ease: 'Power2', // 애니메이션 타입
        });

        // 호버 이벤트 (마우스 오버)
        startText.on('pointerover', () => {
            startText.setStyle({
                color: '#C0C0C0', // 은색
                fontStyle: 'bold',
            });
            // 텍스트 크기 애니메이션
            this.tweens.add({
                targets: startText,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 300,
                ease: 'Power2',
            });
        });

        // 마우스 아웃 이벤트
        startText.on('pointerout', () => {
            startText.setStyle({
                color: '#FFD700', // 금색
                fontStyle: 'normal',
            });
            // 텍스트 크기 애니메이션 되돌리기
            this.tweens.add({
                targets: startText,
                scaleX: 1,
                scaleY: 1,
                duration: 300,
                ease: 'Power2',
            });
        });

        // 클릭 이벤트
        startText.on('pointerdown', () => {
            startText.setStyle({
                color: '#B8860B', // 어두운 금색
            });
            if (this.stageClear){
                alert('플레이 기록 및 저장 데이터가 확인되어 스테이지 선택 화면으로 이동합니다.');
                this.scene.start('StageSelectScene');
            }
            else
                this.scene.start('PrologueScene');
        });

        // 클릭 후 텍스트 색상 원래대로 되돌리기
        startText.on('pointerup', () => {
            startText.setStyle({
                color: '#FFD700', // 기본 금색
            });
        });

        // 텍스트에 그림자 효과
        startText.setShadow(3, 3, '#000000', 2, false, true);
    }
}
