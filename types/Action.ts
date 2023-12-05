import {PlatformEvent} from "./PlatformEvent.js";

export type Action = (event: PlatformEvent) => void;
