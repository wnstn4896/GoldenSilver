export class MessageModule {
    constructor(scene) {
        this.scene = scene;
        this.uiElements = {};
    }

    createUI() {
        const { scene } = this;

        // 배경
        this.uiElements.background = scene.add.image(scene.cameras.main.width / 2, scene.cameras.main.height / 2, '').setOrigin(0.5).setScale(scene.cameras.main.width / 1280, scene.cameras.main.height / 720);

        // 대화 상자
        this.uiElements.dialogBox = scene.add.graphics();
        this.uiElements.dialogBox.fillStyle(0x000000, 0.8);
        this.uiElements.dialogBox.fillRoundedRect(140, 500, 1000, 150, 20);
        this.uiElements.dialogBox.lineStyle(5, 0xffffff, 0.8);
        this.uiElements.dialogBox.strokeRoundedRect(140, 500, 1000, 150, 20); // 테두리 그리기

        // 대화 상자에 클릭 이벤트 추가 (Interactive 설정)
        this.uiElements.dialogBox.setInteractive(new Phaser.Geom.Rectangle(140, 500, 1000, 150), Phaser.Geom.Rectangle.Contains);

        // 대화 상자 클릭 시 호출될 이벤트
        this.uiElements.dialogBox.on('pointerdown', this.onClick.bind(this));

        // 캐릭터 이름 상자
        this.uiElements.nameBox = scene.add.graphics();
        this.uiElements.nameBox.fillStyle(0x000000, 0.8);
        this.uiElements.nameBox.fillRoundedRect(140, 460, 230, 40, 10);
        this.uiElements.nameBox.lineStyle(3, 0xffffff, 0.8);
        this.uiElements.nameBox.strokeRoundedRect(140, 460, 230, 40, 10); // 테두리 그리기

        // 캐릭터 이름 텍스트
        this.uiElements.nameText = scene.add.text(150, 467, '', {
            fontFamily: 'HeirofLightBold',
            fontSize: '20px',
            color: '#ffffff',
            padding: { top: 2, bottom: 2 },
        });

        // 대화 텍스트
        this.uiElements.dialogueText = scene.add.text(200, 540, '', {
            fontSize: '18px',
            fontFamily: 'HeirofLightRegular',
            color: '#ffffff',
            wordWrap: { width: 800 },
            padding: { top: 5, bottom: 2 },
        });
        this.uiElements.dialogueText.setLineSpacing(6); // 줄 간격 설정

        // 대화창 조작 안내 텍스트
        this.uiElements.controlsText = scene.add.text(910, 620, '(Press [SPACE] OR Click)', {
            fontSize: '16px',
            fontFamily: 'HeirofLightRegular',
            color: '#ffffff',
            padding: { top: 2, bottom: 2 },
        });

        // 키 이벤트
        this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // 대화창 클릭 시 호출되는 함수
    onClick() {
        this.onNext();
    }

    // 기본 대화창 스타일
    defaultBox(){
        this.uiElements.dialogBox.fillStyle(0x000000, 0.8);
        this.uiElements.dialogBox.fillRoundedRect(140, 500, 1000, 150, 20);
        this.uiElements.dialogBox.lineStyle(5, 0xffffff, 0.8);
        this.uiElements.dialogBox.strokeRoundedRect(140, 500, 1000, 150, 20);
        this.uiElements.nameBox.fillStyle(0x000000, 0.8);
        this.uiElements.nameBox.fillRoundedRect(140, 460, 230, 40, 10);
        this.uiElements.nameBox.lineStyle(3, 0xffffff, 0.8);
        this.uiElements.nameBox.strokeRoundedRect(140, 460, 230, 40, 10);
        this.uiElements.dialogueText.setStyle({ color: '#ffffff'});
        this.uiElements.controlsText.setStyle({ color: '#ffffff'});
        this.uiElements.nameText.setStyle({color: '#ffffff'});
    }

    updateDialogue(dialogue, onNext) {
        // 대사 배열을 담은 객체
        this.currentDialogue = dialogue;
        this.onNext = onNext;

        const { background, dialogBox, nameBox, nameText, dialogueText, controlsText } = this.uiElements;

        // 배경 업데이트
        if (dialogue.background) {
            background.setTexture(dialogue.background).setVisible(true);
            this.scene.cameras.main.setBackgroundColor('rgba(0,0,0,0)');
        } else {
            background.setVisible(false);
            this.scene.cameras.main.setBackgroundColor('#000000');
        }

        // 대화 상자 및 텍스트 업데이트
        dialogBox.setVisible(true);
        dialogueText.setText(dialogue.text).setVisible(true);

        // 캐릭터 이름 정의하지 않았으면 캐릭터 이름 상자 및 이름 텍스트 비활성화
        if (dialogue.name) {
            nameBox.setVisible(true);
            nameText.setText(dialogue.name).setVisible(true);
        } else {
            this.defaultBox();
            nameBox.setVisible(false);
            nameText.setVisible(false);
        }
        
        // 캐릭터 별 대화 스타일 지정
        switch (dialogue.name) {
            case '리드':
                // 연한 검은색 베이스
                dialogBox.fillStyle(0x363636, 0.8);
                nameBox.fillStyle(0x363636, 0.8);
                dialogBox.fillRoundedRect(140, 500, 1000, 150, 20);
                nameBox.fillRoundedRect(140, 460, 230, 40, 10);
                // 붉은색 테두리
                dialogBox.lineStyle(3, 0x9b111f, 0.8);
                nameBox.lineStyle(3, 0x9b111f, 0.8);
                dialogBox.strokeRoundedRect(140, 500, 1000, 150, 20);
                nameBox.strokeRoundedRect(140, 460, 230, 40, 10);
                dialogueText.setStyle({ color: '#FFFFFF', });
                controlsText.setStyle({ color: '#FFFFFF', });
                nameText.setStyle({ color: '#FFFFFF', });
                break;
            case '아스타':
                // 흰색 베이스
                dialogBox.fillStyle(0xffffff, 0.8);
                nameBox.fillStyle(0xffffff, 0.8);
                dialogBox.fillRoundedRect(140, 500, 1000, 150, 20);
                nameBox.fillRoundedRect(140, 460, 230, 40, 10);
                // 푸른색 테두리
                dialogBox.lineStyle(3, 0x0067a3, 0.8);
                nameBox.lineStyle(3, 0x0067a3, 0.8);
                dialogBox.strokeRoundedRect(140, 500, 1000, 150, 20);
                nameBox.strokeRoundedRect(140, 460, 230, 40, 10);
                dialogueText.setStyle({ color: '#000000', });
                controlsText.setStyle({ color: '#000000', });
                nameText.setStyle({ color: '#000000', });
                break;
            case '로벨리아':
                // 짙은 검은색 
                dialogBox.fillStyle(0x000000, 1);
                nameBox.fillStyle(0x000000, 1);
                dialogBox.fillRoundedRect(140, 500, 1000, 150, 20);
                nameBox.fillRoundedRect(140, 460, 230, 40, 10);
                // 붉은색 테두리
                dialogBox.lineStyle(3, 0x9b111f, 1);
                nameBox.lineStyle(3, 0x9b111f, 1);
                dialogBox.strokeRoundedRect(140, 500, 1000, 150, 20);
                nameBox.strokeRoundedRect(140, 460, 230, 40, 10);
                dialogueText.setStyle({ color: '#FFFFFF', });
                controlsText.setStyle({ color: '#FFFFFF', });
                nameText.setStyle({ color: '#FFFFFF', });
                break;
            default:
                this.defaultBox();
        }

        // 이전 키 리스너 제거 (중복 방지)
        if (this.spaceKeyListener) {
            this.spaceKey.off('down', this.spaceKeyListener);
        }
        // 새로운 키 리스너 등록
        this.spaceKeyListener = () => {
            this.onNext();
        };
        this.spaceKey.on('down', this.spaceKeyListener);
    }

    hideUI() {
        Object.values(this.uiElements).forEach((el) => el.setVisible(false));

        // SPACE 키 리스너 제거
        if (this.spaceKeyListener) {
            this.spaceKey.off('down', this.spaceKeyListener);
            this.spaceKeyListener = null;
        }

        // 클릭 이벤트 리스너 제거
        this.uiElements.dialogBox.off('pointerdown', this.onClick);
    }

    restoreUI() {
        const { background, nameBox, dialogBox, dialogueText, controlsText } = this.uiElements;
        background.setVisible(true);
        nameBox.setVisible(true);
        dialogBox.setVisible(true);
        dialogueText.setVisible(true);
        controlsText.setVisible(true);
    }
}
