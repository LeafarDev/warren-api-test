import glob from "glob";
import {env} from "../env";

export class SubscriberLoader {
	public execute() {
		const patterns = env.app.dirs.subscribers;
		patterns.forEach((pattern) => {
			glob(pattern, (err: any, files: string[]) => {
				for (const file of files) {
					require(file);
				}
			});
		});
	}
}
