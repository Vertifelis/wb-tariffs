import { SchedulerService } from "./scheduler.service.js";

describe("SchedulerService", () => {
    let scheduler: SchedulerService;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.useFakeTimers();
        scheduler = new SchedulerService();
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
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

            jest.advanceTimersByTime(1500);
            expect(mockTask).toHaveBeenCalledTimes(3);
        });

        it("should catch and log errors from the scheduled task", async () => {
            const error = new Error("Task failed");
            const mockTask = jest.fn().mockRejectedValue(error);

            scheduler.scheduleTask(mockTask, 1000);
            jest.advanceTimersByTime(1000);

            await jest.advanceTimersByTimeAsync(0);

            expect(consoleErrorSpy).toHaveBeenCalledWith("Error while executing scheduled task: ", error);
        });

        it("should continue execution after a task error", async () => {
            const error = new Error("First task failed");
            const mockTask1 = jest.fn().mockRejectedValue(error);
            const mockTask2 = jest.fn();

            scheduler.scheduleTask(mockTask1, 500);
            scheduler.scheduleTask(mockTask2, 500);

            jest.advanceTimersByTime(500);
            await jest.advanceTimersByTimeAsync(0);
            expect(consoleErrorSpy).toHaveBeenCalled();

            jest.advanceTimersByTime(500);
            await jest.advanceTimersByTimeAsync(0);
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

        it("should reset internal task handles array", () => {
            scheduler.scheduleTask(() => Promise.resolve(), 1000);
            expect(scheduler["taskHandles"].length).toBe(1);

            scheduler.clearTasks();
            expect(scheduler["taskHandles"].length).toBe(0);
        });

        it("should not throw an error while resetting empty task handles", () => {
            expect(() => scheduler.clearTasks()).not.toThrow();
        });
    });
});
