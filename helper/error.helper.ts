export function getErrorMessage(error: Error) {
  return error instanceof Error && error.message && typeof error.message === "string"
    ? error.message
    : "Something went wrong! Please check your internet connection & try again."
}
