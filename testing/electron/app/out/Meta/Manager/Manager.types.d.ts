import { CommPortTypes } from "Meta/Comm/Comm.types";
export declare type CommManagerData = {
    name: string;
    onPortSet: (port: CommPortTypes, commName: string) => void;
};
