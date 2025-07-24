import { DealModel } from "./deal";

export interface KanbanBoardColumns {
  new: DealModel[];
  inProgress: DealModel[];
  negotiation: DealModel[];
  completed: DealModel[];
}