/**
 * Reference checks for component goal-deliver.
 */

import { componentId, deliver, statement } from './module.js';

export function runReferenceChecks(): { check: string; passed: boolean }[] {
  return [
    { check: "goal-deliver:component-id", passed: componentId === "goal-deliver" },
    { check: "goal-deliver:deliver-statement", passed: deliver().startsWith(componentId + ':') },
    { check: "goal-deliver:statement-non-empty", passed: statement.length > 0 },
  ];
}
