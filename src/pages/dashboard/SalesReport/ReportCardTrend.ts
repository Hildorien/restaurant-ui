/**
 * This class is an abstraction of the Statistics property 'trend'.
 * It encapsulates the parameters of a trend to pass into a Statistics component 
 */
export class ReportCardTrend {

    private _textClass: string;
    public get textClass(): string {
        return this._textClass;
    }
    private _icon: string;
    public get icon(): string {
        return this._icon;
    }
    private _value: string;
    public get value(): string {
        return this._value;
    }
    private _time: string;
    public get time(): string {
        return this._time;
    }

	private constructor(textClass: string, icon: string, value: string, time: string) {
		this._textClass = textClass;
        this._icon = icon;
        this._value = value;
        this._time = time;
	}

    public static UpTrend(value: string, time: string): ReportCardTrend {
        return new ReportCardTrend('text-success me-2', 'mdi mdi-arrow-up-bold', value  + ' %', time);
    }

    public static DownTrend(value: string, time: string): ReportCardTrend { 
        return new ReportCardTrend('text-danger me-2', 'mdi mdi-arrow-down-bold', value  + ' %', time);
    }

}