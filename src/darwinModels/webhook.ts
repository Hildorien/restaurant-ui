import { Topic } from './topic';

export interface WebHook {
	topic: Topic;
	url: string;
	status: boolean;
	stores?: string[];
	secret?: string;
}
