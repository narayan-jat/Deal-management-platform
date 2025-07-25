import { DealCardType } from "./deal/DealCard";

export interface KanbanBoardColumns {
  new: DealCardType[];
  inProgress: DealCardType[];
  negotiation: DealCardType[];
  completed: DealCardType[];
}