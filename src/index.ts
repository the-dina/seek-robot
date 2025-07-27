import { main } from "src/app";
import { ConsoleOutputWriter } from "src/infrastructure/ConsoleOutputWriter";

// Run the application
main().catch((error) => {
  const outputWriter = new ConsoleOutputWriter();
  outputWriter.writeError(
    "Fatal error: " + (error instanceof Error ? error.message : "Unknown error")
  );
  process.exit(1);
});
