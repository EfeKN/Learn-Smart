import GlobalVariables from "@/app/global-variables";

const globalVariables = GlobalVariables.getInstance();

export function printDebugMessage(message: string) {
  if (globalVariables.debug_mode) {
    console.log(message);
  }
}
