import GlobalVariables from "@/app/global-variables";

const globalVariables = GlobalVariables.getInstance();

export function printDebugMessage(message: any) {
  if (globalVariables.debug_mode) {
    console.log(message);
  }
}
