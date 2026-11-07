# Agent instructions

## Commit discipline

Commit related changes made during a task before reporting the task as
complete. Use focused, atomic local commits, including for documentation, tests,
configuration, fixes, and follow-up refinements. Do not leave agent-created
changes uncommitted, and do not include pre-existing unrelated user changes in a
commit.

If a task is large, divide it into sub-sections and commit each completed
sub-section before moving to the next.

## Commit message style

Use a concise, imperative subject with a conventional type and an optional scope:

```text
<type>(<scope>): <summary>
```

Use a blank line followed by consecutive bullet points when a body helps explain
the change. Start each bullet with a capital letter and end it with a period.
Include an issue or pull-request number when relevant.

Examples:

```text
docs(release): record validated 1.2.1 upload archive

- Record the archive size, checksum and successful source-byte validation.
- Update packaging and screenshot status while retaining pending store submission checks.
```

```text
fix(downloads): improve PDF exports and collection reliability for v1.2.1 (#10)
```

```text
docs: refresh README and simplify agent workflow guidance (#9)
```
