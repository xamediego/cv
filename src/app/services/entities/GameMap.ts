import {Project} from "./Project";
import {GameType} from "./GameType";
import { MapEnvironment } from "../enums/MapEnvironment";

export interface GameMap extends Project {
  minimumPlayer: number;
  maximumPlayer: number;
  environment: MapEnvironment;
  gameType?: GameType;
}

