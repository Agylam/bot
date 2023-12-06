import type {PlatformEvent} from "./PlatformEvent.js";
import type {UnityMethods} from "./UnityMethods";

export type Action = (event: PlatformEvent, unityMethods: UnityMethods) => void;
