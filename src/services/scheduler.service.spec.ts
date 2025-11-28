import { SchedulerService } from "./scheduler.service.js";

describe("SchedulerService", () => {
    let scheduler: SchedulerService;

    beforeEach(() => {
        jest.useFakeTimers();
        scheduler = new SchedulerService();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllTimers();
        jest.clearAllMocks();
    });

    describe("scheduleTask", () => {
        it("should execute the scheduled task after the specified interval", () => {
            const mockTask = jest.fn();
            scheduler.scheduleTask(mockTask, 1000);

            expect(mockTask).not.toHaveBeenCalled();

            jest.advanceTimersByTime(1000);

            expect(mockTask).toHaveBeenCalled();
        });

        it("should execute the task repeatedly at the specified interval", () => {
            const mockTask = jest.fn();
            scheduler.scheduleTask(mockTask, 500);

            jest.advanceTimersByTime(500);

            expect(mockTask).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(500);

            expect(mockTask).toHaveBeenCalledTimes(2);
        });

        it("should continue execution after a task error", async () => {
            const error = new Error("First task failed");
            const mockTask1 = jest.fn().mockRejectedValue(error);
            const mockTask2 = jest.fn();
            console.error = jest.fn();

            scheduler.scheduleTask(mockTask1, 500);
            scheduler.scheduleTask(mockTask2, 500);

            jest.advanceTimersByTime(500);

            expect(mockTask1).toHaveBeenCalledTimes(1);
            await expect(mockTask1).rejects.toThrow("First task failed");

            jest.advanceTimersByTime(500);

            expect(mockTask2).toHaveBeenCalledTimes(2);
        });
    });

    describe("clearTasks", () => {
        it("should clear all scheduled tasks", () => {
            const mockTask1 = jest.fn();
            const mockTask2 = jest.fn();

            scheduler.scheduleTask(mockTask1, 500);
            scheduler.scheduleTask(mockTask2, 1000);

            scheduler.clearTasks();
            jest.advanceTimersByTime(2000);

            expect(mockTask1).not.toHaveBeenCalled();
            expect(mockTask2).not.toHaveBeenCalled();
        });

        it("should not throw an error while resetting empty task handles", () => {
            expect(() => scheduler.clearTasks()).not.toThrow();
        });
    });
});
