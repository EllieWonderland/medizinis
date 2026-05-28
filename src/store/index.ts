import { create } from 'zustand';

type OverlayType = 'addMedication' | 'editMedication' | 'leaflet' | 'confirmIntake' | null;

interface AppStore {
  herbBalance: number;
  setHerbBalance: (balance: number) => void;
  addHerbs: (amount: number) => void;

  activeOverlay: OverlayType;
  overlayPayload: unknown;
  openOverlay: (overlay: OverlayType, payload?: unknown) => void;
  closeOverlay: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  herbBalance: 0,
  setHerbBalance: (balance) => set({ herbBalance: balance }),
  addHerbs: (amount) => set((state) => ({ herbBalance: state.herbBalance + amount })),

  activeOverlay: null,
  overlayPayload: null,
  openOverlay: (overlay, payload = null) => set({ activeOverlay: overlay, overlayPayload: payload }),
  closeOverlay: () => set({ activeOverlay: null, overlayPayload: null }),
}));
