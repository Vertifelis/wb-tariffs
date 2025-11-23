export class SchedulerService {
    constructor(private taskHandles: NodeJS.Timeout[] = []) {}

    public scheduleTask(task: () => Promise<void>, intervalMs: number): NodeJS.Timeout {
        const wrappedTask = async () => {
            try {
                await task();
            } catch (error) {
                console.error(`Error while executing scheduled task: ${error}`);
            }
        };

        const taskHandle = setInterval(wrappedTask, intervalMs);
        this.taskHandles.push(taskHandle);

        return taskHandle;
    }

    public clearTasks(): void {
        this.taskHandles.forEach((handle) => {
            clearInterval(handle);
        });
        this.taskHandles = [];
    }
}
