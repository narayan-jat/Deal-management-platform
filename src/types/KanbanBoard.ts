import { DealModel } from "./deal";

export interface KanbanBoardColumns {
  new: DealModel[];
  proposals: DealModel[];
  negotiation: DealModel[];
  inProgress: DealModel[];
}