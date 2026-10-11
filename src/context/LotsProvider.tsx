import { useMemo, useState, type ReactNode } from "react";
import { LotsContext, type LotsContextValue } from "./LotsContext";
import { getLots } from "../services/lotService";
import type { NewLotInput } from "../types";

export default function LotsProvider({ children }: { children: ReactNode }) {
  const [lots, setLots] = useState(getLots);

  const value = useMemo<LotsContextValue>(() => ({
    lots,
    getLot: (id) => lots.find((lot) => lot.id === id),
    gradeLot: (id, grade, weightKg, destination) => setLots((current) => current.map((lot) => (
      lot.id === id ? { ...lot, grade, weightKg, destination, status: "Graded", stage: 2 } : lot
    ))),
    addLot: (input: NewLotInput) => {
      const id = `lot-${Date.now()}`;
      const lot = {
        ...input,
        id,
        variety: input.crop,
        origin: "Diphu Spoke",
        grade: "Pending",
        status: "At spoke" as const,
        stage: 1,
        bids: [],
      };
      setLots((current) => [lot, ...current]);
      return id;
    },
    updateLotStatus: (id, status, stage, destination) => setLots((current) => current.map((lot) => (
      lot.id === id ? { ...lot, status, stage, ...(destination ? { destination } : {}) } : lot
    ))),
    addBid: (id, bid) => setLots((current) => current.map((lot) => (
      lot.id === id ? { ...lot, bids: [...lot.bids, bid] } : lot
    ))),
    acceptBid: (id) => setLots((current) => current.map((lot) => (
      lot.id === id ? { ...lot, status: "Sold", stage: 4 } : lot
    ))),
  }), [lots]);

  return <LotsContext.Provider value={value}>{children}</LotsContext.Provider>;
}
