export class Registro {
    public format: string;
    public type: string;
    public text: string;
    public icon: string;
    public create: Date;

    constructor(format: string, text: string) {
        this.format = format;
        this.text = text;
        this.create = new Date();
        this.determinarTipo();
    }

    private determinarTipo() {
        const inicioText = this.text.substr(0, 4);
        console.log(inicioText);
        switch (inicioText) {
            case 'http':
                this.type = 'http';
                this.icon = 'globe';
                break;
            case 'geo:':
                this.type = 'geo';
                this.icon = 'pin';
                break;
            default:
                this.type = 'no reconocido';
                this.icon = 'create';
                break;
        }
    }
}