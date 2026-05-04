---
agent: 'agent'
description: Execute a single task from a spec file
---

Execute the following task from the spec:

**Spec file:** ${input:specFile:Path to spec file, e.g. .ai/specs/my-feature.md}

**Task:** ${input:task:Task to implement, e.g. T1 or T2}

## Process

1. Read the spec file in full.
2. Find the specified task.
3. Review **Why**, **What**, **Constraints**, and any **Current State** for context.
4. Implement exactly what the task describes — nothing more.
5. Run the **Verify** step defined in the task.

## Rules

- Only this task — ignore others in the spec.
- Only touch files listed in the task's **Files** section.
- No drive-by refactors or additions.
- Follow constraints strictly.
- Write tests if specified in the task.
- Do NOT add dependencies unless specified in **Constraints**.
- If anything is ambiguous or blocked, say so clearly rather than guessing.

## After completion

Report:

- What was implemented
- Files created or modified
- Verification result (pass/fail)
- Any issues or blockers

Suggest next step:

- If more tasks remain: `Read spec and implement TN+1`
- If all tasks complete: Run the **Done** section commands
