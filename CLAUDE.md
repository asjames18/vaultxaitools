# Project Instructions

## Agent Usage

Always use the Agent tool with specialized subagents for tasks. Delegate research, exploration, code review, and multi-step work to appropriate subagents rather than handling everything inline. This consistently produces better results.

- Use `subagent_type=Explore` for codebase searches and file lookups
- Use `subagent_type=Plan` for architecture and implementation planning
- Use `subagent_type=claude-code-guide` for Claude API / Claude Code questions
- Spawn parallel subagents when tasks are independent
- Use the main agent to synthesize subagent results and make final decisions
