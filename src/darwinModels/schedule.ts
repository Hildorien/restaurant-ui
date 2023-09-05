export enum Day {
	monday = 'monday',
	tuesday = 'tuesday',
	wednesday = 'wednesday',
	thursday = 'thursday',
	friday = 'friday',
	saturday = 'saturday',
	sunday = 'sunday',
}

export interface Schedule {
	weekday: Day;
	times: ScheduleTime[];
}

export interface ScheduleTime {
	id?: number;
	start: string;
	end: string;
}
