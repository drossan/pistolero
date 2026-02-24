// Tutorial interactivo para nuevos jugadores

const TUTORIAL_KEY = "el_pistolero_tutorial_completed";

export function isTutorialCompleted(): boolean {
  try {
    return localStorage.getItem(TUTORIAL_KEY) === "true";
  } catch {
    return false;
  }
}

export function markTutorialCompleted(): void {
  try {
    localStorage.setItem(TUTORIAL_KEY, "true");
  } catch (e) {
    console.error("Error marking tutorial:", e);
  }
}

export function resetTutorial(): void {
  try {
    localStorage.removeItem(TUTORIAL_KEY);
  } catch (e) {
    console.error("Error resetting tutorial:", e);
  }
}
