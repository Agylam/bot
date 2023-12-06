import {PlatformEvent} from "./PlatformEvent.js";
import {UnityMethods} from "./UnityMethods";

export type Action = (event: PlatformEvent, unityMethods: UnityMethods) => void;
