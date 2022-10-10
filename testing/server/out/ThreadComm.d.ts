import type { CommManagerData } from "Meta/Manager/Manager.types.js";
import { Task } from "./Tasks/Tasks.js";
import { CommManager } from "./Manager/CommManager.js";
import { CommBase } from "./Comm/Comm.js";
import { SyncedQueue } from "./Queue/SyncedQueue.js";
export declare const ThreadComm: {
    threadNumber: number;
    threadName: string;
    environment: "browser" | "node";
    comms: Record<string, CommBase>;
    commManageras: Record<string, CommManager>;
    tasks: Record<string, Task<any>>;
    queues: Record<string, SyncedQueue>;
    parent: CommBase;
    __internal: Record<number, Record<number, (data: any, event: any) => void>>;
    __initalized: boolean;
    __expectedPorts: Record<string, boolean>;
    $INIT(threadName: string): Promise<void>;
    getSyncedQueue(queueId: string): SyncedQueue;
    createComm<T>(name: string, mergeObject?: T): T & CommBase;
    createCommManager(data: CommManagerData): CommManager;
    getComm(id: string): CommBase;
    getCommManager(id: string): CommManager;
    __throwError(message: string): never;
    expectPorts(portIds: string[]): undefined;
    getWorkerPort(): Promise<any>;
    __handleInternalMessage(data: any[], event: any): void;
    __isInternalMessage(data: any[]): boolean;
    __handleTasksMessage(data: any[]): Promise<void>;
    __isTasks(data: any[]): boolean;
    registerTasks<T_1>(id: string, run: (data: T_1) => void): void;
};
