import { MessageModule } from './MessageModule.js';

export class PrologueScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PrologueScene' });
        this.dialogues = [];
        this.currentIndex = 0;
    }

    create() {
        this.dialogues = this.cache.json.get('PrologueDialogues');
        this.MessageModule = new MessageModule(this);
        this.MessageModule.createUI();
        this.onNextDialogue();

        this.bgm = this.sound.add('prologueBGM', { loop: true });
        this.bgm.play();
    }

    onNextDialogue() {
        // 대사 출력 진행
        if (this.currentIndex < this.dialogues.length) {
            const dialogue = this.dialogues[this.currentIndex];
            this.MessageModule.updateDialogue(dialogue, () => {
                this.currentIndex++;
                this.onNextDialogue();
            });
            // 플래시 효과
            if (dialogue.flash === 'black')
                this.cameras.main.flash(1000, 0, 0, 0);

            if (this.currentIndex === 14)
                this.bgm.stop();
        } else {
            this.endScene();
        }
    }
    
    endScene() {
        this.bgm.stop();
        this.scene.start('FieldScene');
    }
    
}
